/**
 * Fills the Studio with the form wording and the Contact page placeholders, in
 * English and Arabic. It never overwrites a field that already has content, so it
 * is safe to run more than once.
 *
 *   cd frontend
 *   npx sanity exec scripts/seedContactContent.ts --with-user-token            # write
 *   npx sanity exec scripts/seedContactContent.ts --with-user-token -- --dry-run
 *   npx sanity exec scripts/seedContactContent.ts --with-user-token -- --remove-legacy
 *
 * What it does:
 * - Forms › Contact Us: adds the Wording (labels, headings, product prefill).
 * - Forms › Quote Request: creates the document if missing (recipients copied from
 *   Contact Us) and adds its Wording and option lists. Booth options link to
 *   products whose English title matches.
 * - Contact Page: adds the process steps and FAQ.
 * - With --remove-legacy: deletes values left in fields the schema no longer has
 *   (the Contact page's old address, form and direct-channel fields, and the
 *   forms' HubSpot and description fields), in published documents and drafts.
 */
import {getCliClient} from 'sanity/cli'

import {
  BOOTH_OPTIONS,
  CITY_OPTIONS,
  CONTACT_COPY,
  CONTACT_METHOD_OPTIONS,
  EVENT_TYPE_OPTIONS,
  EXTRA_OPTIONS,
  QUOTE_STRINGS,
  type Option,
  QUOTE_UPDATES_LABEL,
} from '../app/components/forms/copy'

const client = getCliClient({apiVersion: '2025-09-25'})
const dryRun = process.argv.includes('--dry-run')
const removeLegacy = process.argv.includes('--remove-legacy')

/** Fields removed from the schema; their values otherwise show as "Unknown field" in the Studio. */
const LEGACY_FIELDS = {
  contact: [
    'form',
    'addressTitle',
    'googleMapsUrl',
    'mapImage',
    'channelsHeading',
    'whatsapp',
    'phonesHeading',
    'phoneLines',
    'departmentsHeading',
    'departmentLines',
    'showroom',
  ],
  formConfig: ['description', 'hubspotFormId', 'notificationsSubscriptionTypeId'],
}

const CONTACT_PAGE_ID = 'contactPage'
const QUOTE_FORM_ID = 'formConfig-quote-request'

const key = () => Math.random().toString(36).slice(2, 14)

type Pair = {en: string; ar: string}

const localized = (type: 'String' | 'Text', {en, ar}: Pair) => [
  {_type: `internationalizedArray${type}Value`, _key: key(), language: 'en', value: en},
  {_type: `internationalizedArray${type}Value`, _key: key(), language: 'ar', value: ar},
]
const str = (en: string, ar: string) => localized('String', {en, ar})
const txt = (en: string, ar: string) => localized('Text', {en, ar})

const paragraph = (text: string) => [
  {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text, marks: []}],
  },
]
const rich = (en: string, ar: string) => [
  {
    _type: 'internationalizedArrayBlockContentTextOnlyValue',
    _key: key(),
    language: 'en',
    value: paragraph(en),
  },
  {
    _type: 'internationalizedArrayBlockContentTextOnlyValue',
    _key: key(),
    language: 'ar',
    value: paragraph(ar),
  },
]

/** Copy fields stored as multi-line text in the schema; the rest are single-line strings. */
const LONG_FIELDS = new Set(['heading', 'description'])

function copyObject(type: string, copy: {en: Record<string, string>; ar: Record<string, string>}) {
  const out: Record<string, unknown> = {_type: type}
  for (const field of Object.keys(copy.en)) {
    out[field] = (LONG_FIELDS.has(field) ? txt : str)(copy.en[field], copy.ar[field])
  }
  return out
}

const option = (o: Option) => ({
  _type: 'formOption',
  _key: key(),
  label: str(o.en, o.ar),
  ...(o.noteEn && o.noteAr ? {note: str(o.noteEn, o.noteAr)} : {}),
})

async function boothOptions() {
  const products = await client.fetch<{_id: string; title: string | null}[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{_id, "title": title[language == "en"][0].value}`,
  )
  const byTitle = new Map(
    products.filter((p) => p.title).map((p) => [p.title!.trim().toLowerCase(), p._id]),
  )
  return BOOTH_OPTIONS.map((o) => {
    const productId = byTitle.get(o.en.toLowerCase())
    const note = o.noteEn && o.noteAr ? {note: str(o.noteEn, o.noteAr)} : {}
    return productId
      ? {_type: 'boothOption', _key: key(), product: {_type: 'reference', _ref: productId}, ...note}
      : {_type: 'boothOption', _key: key(), label: str(o.en, o.ar), ...note}
  })
}

// Placeholders for the client to replace.
const CONTACT_PAGE_CONTENT = {
  processHeading: str('What happens next', 'ماذا يحدث بعد ذلك'),
  processSteps: [
    {
      title: str('Send your request', 'أرسل طلبك'),
      body: txt(
        'Share your event details in the form above. It takes about two minutes.',
        'شاركنا تفاصيل فعاليتك في النموذج أعلاه. لن يستغرق الأمر أكثر من دقيقتين.',
      ),
    },
    {
      title: str('A producer reviews it', 'يراجعه أحد منتجينا'),
      body: txt(
        'A Boothclub producer checks availability and picks the right booths for your space and guests.',
        'يتحقق أحد منتجي بوث كلوب من التوفر ويختار البوثات المناسبة لمساحتك وضيوفك.',
      ),
    },
    {
      title: str('Your quote within 48 hours', 'عرض سعرك خلال 48 ساعة'),
      body: txt(
        'You receive a tailored, itemised quotation within 48 hours, often sooner.',
        'تستلم عرض سعر مخصصاً ومفصلاً خلال 48 ساعة، وغالباً قبل ذلك.',
      ),
    },
    {
      title: str('A call to finalize', 'مكالمة لإتمام التفاصيل'),
      body: txt(
        'We confirm branding, timings and logistics on a short call, then lock in your date.',
        'نؤكد التصاميم والتوقيت والتجهيزات في مكالمة قصيرة، ثم نثبّت موعدك.',
      ),
    },
  ].map((step) => ({_type: 'processStep', _key: key(), ...step})),

  faqHeading: str('Questions', 'الأسئلة الشائعة'),
  faq: [
    {
      question: str('How far ahead should we book?', 'كم من الوقت مسبقاً يجب أن نحجز؟'),
      answer: rich(
        'We recommend booking 3–4 weeks ahead, and 6–8 weeks for custom builds or busy seasons such as Q4, Ramadan and Eid. Last-minute requests are welcome; we confirm availability within a working day.',
        'ننصح بالحجز قبل 3–4 أسابيع، وقبل 6–8 أسابيع للتصاميم الخاصة أو المواسم المزدحمة مثل الربع الأخير ورمضان والعيد. نرحب بالطلبات العاجلة ونؤكد التوفر خلال يوم عمل.',
      ),
    },
    {
      question: str('Which cities do you cover?', 'ما المدن التي تغطونها؟'),
      answer: rich(
        'We run events across the UAE and Saudi Arabia from our Dubai and Riyadh teams, and travel elsewhere in the GCC. Travel and freight outside our home cities are quoted separately.',
        'ننظم فعاليات في أنحاء الإمارات والسعودية عبر فريقينا في دبي والرياض، ونسافر إلى باقي دول الخليج. تُسعَّر تكاليف السفر والشحن خارج مدننا الأساسية بشكل منفصل.',
      ),
    },
    {
      question: str(
        'How much space and power does a booth need?',
        'ما المساحة والطاقة الكهربائية التي يحتاجها البوث؟',
      ),
      answer: rich(
        'Most booths need about 3 × 3 m of floor space and one standard power socket within 5 m. Glambot and walk-in tunnels need more room; your producer will confirm the exact footprint for your venue.',
        'تحتاج معظم البوثات إلى مساحة 3 × 3 أمتار تقريباً ومقبس كهرباء عادي على بعد 5 أمتار. يحتاج جلامبوت والأنفاق مساحة أكبر، وسيؤكد لك المنتج المساحة الدقيقة لمكانك.',
      ),
    },
    {
      question: str('What’s included?', 'ما الذي تشمله الخدمة؟'),
      answer: rich(
        'Every booking includes an on-site attendant, delivery, setup and breakdown, unlimited sessions during your booked hours, instant prints on booths that support them, and a digital gallery guests reach by QR code.',
        'يشمل كل حجز مشرفاً في الموقع، والتوصيل والتركيب والفك، وجلسات غير محدودة خلال الساعات المحجوزة، وطباعة فورية في البوثات التي تدعمها، ومعرضاً رقمياً يصل إليه الضيوف عبر رمز QR.',
      ),
    },
    {
      question: str('How does pricing work?', 'كيف يتم التسعير؟'),
      answer: rich(
        'Every event is priced case by case, based on the booths, hours, location, branding and extras you choose. Send your details and a producer will send an itemised quotation within 48 hours.',
        'يُسعَّر كل حدث حسب تفاصيله: البوثات والساعات والموقع والتصاميم والإضافات التي تختارها. أرسل بياناتك وسيرسل لك أحد منتجينا عرض سعر مفصلاً خلال 48 ساعة.',
      ),
    },
  ].map((item) => ({_type: 'faqItem', _key: key(), ...item})),
}

async function run() {
  const contactForm = await client.fetch<{_id: string; recipients?: string[]} | null>(
    `*[_type == "formConfig" && key == "contact-us" && !(_id in path("drafts.**"))][0]{_id, recipients}`,
  )
  const quoteForm = await client.fetch<{_id: string} | null>(
    `*[_type == "formConfig" && key == "quote-request" && !(_id in path("drafts.**"))][0]{_id}`,
  )
  const quoteCopy = {
    ...copyObject('quoteFormCopy', QUOTE_STRINGS),
    eventTypes: EVENT_TYPE_OPTIONS.map(option),
    cities: CITY_OPTIONS.map(option),
    booths: await boothOptions(),
    extras: EXTRA_OPTIONS.map(option),
    contactMethods: CONTACT_METHOD_OPTIONS.map(option),
  }

  const tx = client.transaction()
  const log: string[] = []

  if (contactForm) {
    tx.patch(contactForm._id, (p) =>
      p.setIfMissing({contactCopy: copyObject('contactFormCopy', CONTACT_COPY)}),
    )
    log.push(`Contact Us (${contactForm._id}): wording added where empty`)
  } else {
    log.push('Contact Us form not found: skipped its wording')
  }

  const quoteId = quoteForm?._id ?? QUOTE_FORM_ID
  tx.createIfNotExists({
    _id: quoteId,
    _type: 'formConfig',
    key: 'quote-request',
    recipients: contactForm?.recipients ?? [],
  })
  tx.patch(quoteId, (p) =>
    p.setIfMissing({
      quoteCopy,
      notificationsLabel: str(QUOTE_UPDATES_LABEL.en, QUOTE_UPDATES_LABEL.ar),
    }),
  )
  log.push(
    quoteForm
      ? `Quote Request (${quoteId}): wording added where empty`
      : `Quote Request created as ${quoteId} with recipients copied from Contact Us`,
  )

  tx.createIfNotExists({_id: CONTACT_PAGE_ID, _type: 'contact'})
  tx.patch(CONTACT_PAGE_ID, (p) => p.setIfMissing(CONTACT_PAGE_CONTENT))
  log.push('Contact Page: sections added where empty')

  if (removeLegacy) {
    // Drafts included, or an open draft would bring the old values back on publish.
    const docs = await client.fetch<{_id: string; _type: 'contact' | 'formConfig'}[]>(
      `*[_type in ["contact", "formConfig"]]{_id, _type}`,
    )
    for (const doc of docs) {
      tx.patch(doc._id, (p) => p.unset(LEGACY_FIELDS[doc._type]))
    }
    log.push(`Removed legacy fields from ${docs.length} documents (drafts included)`)
  }

  if (dryRun) {
    console.log('Dry run, nothing written. Planned mutations:')
    console.log(JSON.stringify(tx.serialize(), null, 2))
  } else {
    await tx.commit()
  }
  console.log(log.map((line) => `- ${line}`).join('\n'))
  console.log(
    'Note: open drafts of these documents override what was written; publish or discard them.',
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
