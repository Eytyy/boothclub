import {stegaClean} from '@sanity/client/stega'

import type {ContactPageQueryResult} from '@/sanity.types'
import type {Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'
import {cn} from '@/app/lib/utils'
import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import SectionHeading from '@/app/components/ui/SectionHeading'
import ArrowIcon from '@/app/components/ui/icons/ArrowIcon'

type Page = NonNullable<ContactPageQueryResult>

type Props = Pick<
  Page,
  | 'whatsapp'
  | 'phonesHeading'
  | 'phoneLines'
  | 'departmentsHeading'
  | 'departmentLines'
  | 'showroom'
> & {lang: Locale}

const digits = (value: string) => stegaClean(value).replace(/[^\d+]/g, '')

/** "GMT+4" for an IANA zone, in the page language; nothing if the zone is unknown. */
function utcOffset(timeZone: string, lang: Locale): string | null {
  try {
    const parts = new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date())
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? null
  } catch {
    return null
  }
}

const buttonClass =
  'inline-flex items-center gap-2 px-10 py-5 text-sm font-normal sm:text-base md:text-lg lg:text-xl xl:text-2xl lowercase tracking-normal transition-colors'

/** Phone numbers and emails stay left-to-right inside Arabic text. */
const Ltr = ({children}: {children: React.ReactNode}) => <bdi dir="ltr">{children}</bdi>

export default function DirectChannels({
  lang,
  whatsapp,
  phonesHeading,
  phoneLines,
  departmentsHeading,
  departmentLines,
  showroom,
}: Props) {
  const t = getDictionary(lang)
  const phones = (phoneLines ?? []).filter((p) => p.city && p.number)
  const departments = (departmentLines ?? []).filter((d) => d.label && (d.email || d.phone))
  const whatsappNumber = whatsapp?.number ? digits(whatsapp.number).replace('+', '') : ''
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}${whatsapp?.message ? `?text=${encodeURIComponent(stegaClean(whatsapp.message))}` : ''}`
    : null
  const showroomHref = showroom?.link ? stegaClean(showroom.link) : null
  const showroomExternal = Boolean(showroomHref?.startsWith('http'))

  const hasTopRow = Boolean(whatsappHref || showroom?.title)
  const hasBottomRow = phones.length > 0 || departments.length > 0
  if (!hasTopRow && !hasBottomRow) return null

  return (
    <>
      {hasTopRow ? (
        <GridContainer
          columns={whatsappHref && showroom?.title ? [6, 6] : 'none'}
          className="border-b-site border-black dark:border-white"
        >
          {whatsappHref ? (
            <GridColumn
              span={showroom?.title ? 6 : 'full'}
              className="bg-black text-white dark:bg-white dark:text-black p-5 lg:p-10 space-y-5 max-lg:border-b-site max-lg:border-white dark:max-lg:border-black"
            >
              {whatsapp?.title ? <h3 className="text-reveal-compact">{whatsapp.title}</h3> : null}
              {whatsapp?.body ? <p className="body-text max-w-150">{whatsapp.body}</p> : null}
              <p className="text-lg font-medium">
                <Ltr>{stegaClean(whatsapp?.number ?? '')}</Ltr>
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonClass,
                  'bg-white text-black hover:bg-white/85 dark:bg-black dark:text-white dark:hover:bg-black/85',
                )}
              >
                {whatsapp?.buttonLabel || t['contact.whatsappButton']} <ArrowIcon lang={lang} />
                <span className="sr-only">{t['contact.opensInNewTab']}</span>
              </a>
            </GridColumn>
          ) : null}
          {showroom?.title ? (
            <GridColumn span={whatsappHref ? 6 : 'full'} className="p-5 lg:p-10 space-y-5">
              <h3 className="text-reveal-compact">{showroom.title}</h3>
              {showroom.body ? <p className="body-text max-w-150">{showroom.body}</p> : null}
              {showroomHref && showroom.buttonLabel ? (
                <a
                  href={showroomHref}
                  {...(showroomExternal ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
                  className={cn(buttonClass, 'bg-black text-white dark:bg-white dark:text-black')}
                >
                  {showroom.buttonLabel} <ArrowIcon lang={lang} />
                  {showroomExternal ? (
                    <span className="sr-only">{t['contact.opensInNewTab']}</span>
                  ) : null}
                </a>
              ) : null}
            </GridColumn>
          ) : null}
        </GridContainer>
      ) : null}

      {hasBottomRow ? (
        <GridContainer
          columns={phones.length && departments.length ? [6, 6] : 'none'}
          className="border-b-site border-black dark:border-white"
        >
          {phones.length > 0 ? (
            <GridColumn
              span={departments.length ? 6 : 'full'}
              className="max-lg:border-b-site border-black dark:border-white"
            >
              <SectionHeading as="h3">{phonesHeading || t['contact.phonesHeading']}</SectionHeading>
              <ul className="p-5 lg:p-10">
                {phones.map((p) => {
                  const offset = p.timeZone ? utcOffset(stegaClean(p.timeZone), lang) : null
                  return (
                    <li
                      key={p._key}
                      className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-t border-black/30 py-4 first:border-t-0 first:pt-0 dark:border-white/30"
                    >
                      <span className="text-lg font-semibold lg:text-2xl">{p.city}</span>
                      <a href={`tel:${digits(p.number!)}`} className="text-lg hover:underline">
                        <Ltr>{stegaClean(p.number!)}</Ltr>
                      </a>
                      {p.hours || offset ? (
                        <span className="w-full text-sm">
                          {p.hours}
                          {p.hours && offset ? ' · ' : null}
                          {offset ? <Ltr>{offset}</Ltr> : null}
                        </span>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </GridColumn>
          ) : null}
          {departments.length > 0 ? (
            <GridColumn span={phones.length ? 6 : 'full'}>
              <SectionHeading as="h3">
                {departmentsHeading || t['contact.departmentsHeading']}
              </SectionHeading>
              <ul className="p-5 lg:p-10">
                {departments.map((d) => (
                  <li
                    key={d._key}
                    className="space-y-1 border-t border-black/30 py-4 first:border-t-0 first:pt-0 dark:border-white/30"
                  >
                    <p className="text-lg font-semibold lg:text-2xl">{d.label}</p>
                    {d.note ? <p className="text-sm">{d.note}</p> : null}
                    <p className="flex flex-wrap gap-x-5 text-lg">
                      {d.email ? (
                        <a
                          href={`mailto:${stegaClean(d.email)}`}
                          className="underline underline-offset-2 hover:no-underline"
                        >
                          <Ltr>{stegaClean(d.email)}</Ltr>
                        </a>
                      ) : null}
                      {d.phone ? (
                        <a href={`tel:${digits(d.phone)}`} className="hover:underline">
                          <Ltr>{stegaClean(d.phone)}</Ltr>
                        </a>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </GridColumn>
          ) : null}
        </GridContainer>
      ) : null}
    </>
  )
}
