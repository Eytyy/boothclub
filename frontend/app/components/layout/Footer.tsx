import FooterNav from './FooterNav'
import ArrowButton from '@/app/components/ui/ArrowButton'
import LogoStatic from '@/app/components/ui/LogoStatic'
import PortableText from '@/app/components/ui/PortableText'
import SocialIcon from '@/app/components/ui/SocialIcon'
import TrademarkIcon from '@/app/components/ui/TrademarkIcon'
import type {Locale} from '@/app/lib/i18n/config'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {linkResolver, toPortableTextBlocks} from '@/sanity/lib/utils'
import type {DereferencedLink} from '@/sanity/lib/types'
import {resolveButtonLink} from '@/app/lib/sanity/button'
import type {SettingsQueryResult} from '@/sanity.types'
import {GridContainer, GridBlock} from '@/app/components/ui/GridSystem'

/** Single location row from `settingsQuery`. */
type FooterLocation = NonNullable<NonNullable<SettingsQueryResult>['locations']>[number]
/** Single social link row from `settingsQuery`. */
type FooterSocialLink = NonNullable<NonNullable<SettingsQueryResult>['socialLinks']>[number]
/** Footer menu items from `settingsQuery` (`settings.footerMenu[]`), excluding GROQ nulls. */
type FooterMenuRow = NonNullable<NonNullable<SettingsQueryResult>['footerMenu']>[number]
type FooterMenuItem = NonNullable<FooterMenuRow>

export default async function Footer({lang}: {lang: Locale}) {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    params: {lang},
  })
  const s = settings as SettingsQueryResult | null
  const cta = s?.getInTouchCTA
  const ctaLink = resolveButtonLink(cta)
  const locations = s?.locations?.filter(Boolean) ?? []
  const socialLinks: FooterSocialLink[] =
    s?.socialLinks?.filter((sl): sl is FooterSocialLink => Boolean(sl?.link && sl?.platform)) ?? []
  const footerMenu: FooterMenuItem[] | undefined = s?.footerMenu?.filter(
    (row): row is FooterMenuItem => row != null,
  )

  return (
    <footer className="relative container" id="footer">
      <GridContainer className="" variant="compact">
        <div className="col-span-full   relative bg-white z-10 border-y-site border-black dark:border-white space-y-4 dark:bg-black dark:text-white">
          <div className="p-10 pb-5">
            <LogoStatic linkToHome={false} />
          </div>
          {cta ? (
            <GetInTouchCTA
              heading={cta.heading}
              buttonLabel={cta.buttonLabel}
              link={ctaLink}
              lang={lang}
            />
          ) : null}
        </div>
        <div className="col-span-full relative bg-white z-10 border-b-site border-black dark:border-white dark:bg-black dark:text-white">
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 ">
              {locations.map((location, index) => (
                <LocationCard key={`${location.name ?? 'loc'}-${index}`} location={location} />
              ))}
            </div>
          ) : null}
        </div>
        <div className="col-span-full p-10 bg-white relative dark:bg-black dark:text-white">
          <FooterBottomBar footerMenu={footerMenu} socialLinks={socialLinks} lang={lang} />
        </div>
      </GridContainer>
    </footer>
  )
}

const LocationCard = ({location}: {location: FooterLocation}) => {
  const blocks = toPortableTextBlocks(location?.content)
  return (
    <div className="flex flex-col text-sm lg:text-lg min-w-0 p-10 border-e-site border-black dark:border-white last:border-e-0 space-y-5">
      {location?.name ? <p className="text-base lg:text-4xl font-bold">{location.name}</p> : null}
      {blocks.length > 0 ? (
        <PortableText
          value={blocks}
          invert={false}
          className="text-sm lg:text-lg wrap-break-word [&_a]:underline [&_a]:underline-offset-2"
        />
      ) : null}
    </div>
  )
}

function FooterBottomBar({
  footerMenu,
  socialLinks,
  lang,
}: {
  footerMenu: FooterMenuItem[] | undefined
  socialLinks: FooterSocialLink[]
  lang: Locale
}) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-3 items-center gap-4">
      <p className="flex items-center gap-2 text-sm justify-self-start">
        <TrademarkIcon aria-hidden /> BOOTHCLUB {new Date().getFullYear()}
      </p>
      {footerMenu && footerMenu.length > 0 ? (
        <FooterNav items={footerMenu} lang={lang} />
      ) : (
        <span className="justify-self-center" aria-hidden="true" />
      )}
      {socialLinks.length > 0 ? (
        <ul className="flex items-center gap-4 md:justify-self-end">
          {socialLinks.map((s, i) => (
            <li key={`${s.platform}-${i}`}>
              <a
                href={s.link!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label ?? s.platform ?? undefined}
                className="transition-opacity hover:opacity-80"
              >
                <SocialIcon platform={s.platform} />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <span className="justify-self-end" aria-hidden="true" />
      )}
    </div>
  )
}

const GetInTouchCTA = ({
  buttonLabel,
  link,
  lang,
}: {
  heading: string | null | undefined
  buttonLabel: string | null | undefined
  link: DereferencedLink | undefined
  lang: Locale
}) => {
  return (
    <div className="flex gap-6 flex-wrap items-center justify-end">
      {buttonLabel && buttonLabel !== null && link && linkResolver(link, lang) ? (
        <ArrowButton variant="footer" link={link} className="shrink-0 self-end">
          {buttonLabel}
        </ArrowButton>
      ) : null}
    </div>
  )
}
