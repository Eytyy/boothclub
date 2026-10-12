import {stegaClean} from '@sanity/client/stega'

import type {Locale} from '@/app/lib/i18n/config'
import type {FormConfigByKeyQueryResult} from '@/sanity.types'
import type {FormSettings} from './config'

/**
 * Form wording. Editors own it in Sanity (Forms › Contact Us / Quote Request ›
 * Wording); the values below are the fallback for any field left empty and the
 * source for `studio/scripts/seedContent.ts`.
 */

export type FormOption = {
  /** English label, used in the notification email whatever the visitor's language. */
  value: string
  label: string
  note?: string | null
}

export type ContactCopy = {
  eyebrow: string
  heading: string
  fullName: string
  email: string
  phone: string
  message: string
  /** `{product}` is replaced with the product name. */
  productPrefill: string
  submit: string
}

export type QuoteCopy = {
  eyebrow: string
  heading: string
  description: string
  basicsStep: string
  eventTypeQuestion: string
  eventTypes: FormOption[]
  cityQuestion: string
  cities: FormOption[]
  dateLabel: string
  guestsLabel: string
  guestsPlaceholder: string
  boothsStep: string
  boothsQuestion: string
  boothsHint: string
  booths: FormOption[]
  extrasStep: string
  extrasQuestion: string
  extrasHint: string
  extras: FormOption[]
  notesLabel: string
  notesPlaceholder: string
  detailsStep: string
  detailsQuestion: string
  detailsHint: string
  fullName: string
  company: string
  email: string
  phone: string
  phonePlaceholder: string
  contactMethodLabel: string
  contactMethods: FormOption[]
  /** `{current}` and `{total}`. */
  stepCounter: string
  /** `{count}`. */
  selectedCount: string
  noneSelected: string
  back: string
  next: string
  submit: string
}

/** A built-in option in both languages; `en` doubles as the email value. */
export type Option = {en: string; ar: string; noteEn?: string; noteAr?: string}

const options = (list: Option[], lang: Locale): FormOption[] =>
  list.map((o) => ({
    value: o.en,
    label: o[lang],
    note: lang === 'ar' ? o.noteAr : o.noteEn,
  }))

export const EVENT_TYPE_OPTIONS: Option[] = [
  {en: 'Brand activation', ar: 'تفعيل علامة تجارية'},
  {en: 'Retail launch', ar: 'إطلاق منتج'},
  {en: 'Corporate', ar: 'فعالية شركات'},
  {en: 'Wedding', ar: 'حفل زفاف'},
  {en: 'Private party', ar: 'حفلة خاصة'},
]

export const CITY_OPTIONS: Option[] = [
  {en: 'Dubai', ar: 'دبي'},
  {en: 'Abu Dhabi', ar: 'أبوظبي'},
  {en: 'Riyadh', ar: 'الرياض'},
  {en: 'Elsewhere in GCC', ar: 'مكان آخر في الخليج'},
]

export const BOOTH_OPTIONS: Option[] = [
  {
    en: 'Glambot',
    ar: 'جلامبوت',
    noteEn: 'Slow-motion video, robotic camera arm',
    noteAr: 'فيديو بالحركة البطيئة بذراع كاميرا آلية',
  },
  {
    en: 'AI Booth',
    ar: 'بوث الذكاء الاصطناعي',
    noteEn: 'Portraits in your campaign look',
    noteAr: 'صور بأسلوب حملتك',
  },
  {en: 'Aura Booth', ar: 'بوث الهالة', noteEn: 'Colour-aura portraits', noteAr: 'صور بهالة لونية'},
  {
    en: 'Scribble Booth',
    ar: 'بوث الرسم',
    noteEn: 'Guests draw on their photos',
    noteAr: 'يرسم الضيوف على صورهم',
  },
  {
    en: 'Classic Booth',
    ar: 'البوث الكلاسيكي',
    noteEn: 'Instant prints and GIFs',
    noteAr: 'طباعة فورية وصور متحركة',
  },
  {
    en: 'Mirror & Neon Tunnels',
    ar: 'أنفاق المرايا والنيون',
    noteEn: 'Walk-in sets for group shots',
    noteAr: 'مساحات للصور الجماعية',
  },
  {
    en: 'Custom Build',
    ar: 'تصميم خاص',
    noteEn: 'Designed around your brand',
    noteAr: 'مصمم حول علامتك التجارية',
  },
  {
    en: 'Not sure yet',
    ar: 'لم أقرر بعد',
    noteEn: 'We’ll recommend one for you',
    noteAr: 'سنقترح عليك الأنسب',
  },
]

export const EXTRA_OPTIONS: Option[] = [
  {
    en: 'Branded booth shell',
    ar: 'هيكل بوث بعلامتك',
    noteEn: 'Wrapped in your artwork and colours',
    noteAr: 'مغلف بتصاميمك وألوانك',
  },
  {
    en: 'Custom overlays & AI styles',
    ar: 'إطارات وأنماط ذكاء اصطناعي خاصة',
    noteEn: 'Frames, filters and looks designed for the event',
    noteAr: 'إطارات وفلاتر وأنماط مصممة للفعالية',
  },
  {
    en: 'Sharing microsite',
    ar: 'موقع مصغر للمشاركة',
    noteEn: 'Guests get their photos by QR, email or WhatsApp',
    noteAr: 'يستلم الضيوف صورهم عبر رمز QR أو البريد أو واتساب',
  },
  {
    en: 'Data capture',
    ar: 'جمع البيانات',
    noteEn: 'Opt-in sign-ups, with a report after',
    noteAr: 'تسجيلات بموافقة الضيوف مع تقرير بعد الفعالية',
  },
  {
    en: 'Extra hours',
    ar: 'ساعات إضافية',
    noteEn: 'Beyond the standard package',
    noteAr: 'إضافة إلى الباقة الأساسية',
  },
]

export const CONTACT_METHOD_OPTIONS: Option[] = [
  {en: 'WhatsApp', ar: 'واتساب'},
  {en: 'Email', ar: 'البريد الإلكتروني'},
  {en: 'Phone call', ar: 'مكالمة هاتفية'},
]

export const CONTACT_COPY: Record<Locale, ContactCopy> = {
  en: {
    eyebrow: 'Get an Instant Quote',
    heading: 'Tell us the vision, we bring the setup, the tech, the vibe and the results.',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Got a specific booth in mind for your event? Let us know!',
    productPrefill: 'I’m interested in the {product}.',
    submit: 'Submit',
  },
  ar: {
    eyebrow: 'احصل على عرض سعر فوري',
    heading: 'شاركنا رؤيتك، ونحن نتكفل بالتجهيز والتقنية والأجواء والنتائج.',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    message: 'هل تفكر في بوث معيّن لفعاليتك؟ أخبرنا!',
    productPrefill: 'أنا مهتم بـ {product}.',
    submit: 'إرسال',
  },
}

type QuoteStrings = Omit<
  QuoteCopy,
  'eventTypes' | 'cities' | 'booths' | 'extras' | 'contactMethods'
>

export const QUOTE_STRINGS: Record<Locale, QuoteStrings> = {
  en: {
    eyebrow: 'Get a quote',
    heading: 'Tell us the vision, we bring the setup, the tech, the vibe and the results.',
    description:
      'Tell us about your event in four quick steps. Every project is priced case by case, so a producer prepares a tailored quotation and sends it within 48 hours.',
    basicsStep: 'Event basics',
    eventTypeQuestion: 'What kind of event?',
    cityQuestion: 'Where?',
    dateLabel: 'Event date',
    guestsLabel: 'Expected guests (optional)',
    guestsPlaceholder: 'e.g. 250',
    boothsStep: 'Booths',
    boothsQuestion: 'Which experiences are you after?',
    boothsHint: 'Pick as many as you like. You can change this later.',
    extrasStep: 'Extras',
    extrasQuestion: 'Anything on top?',
    extrasHint: 'An attendant, setup and a digital gallery are always included.',
    notesLabel: 'Anything else we should know? (optional)',
    notesPlaceholder: 'Venue, theme, timings, a reference you love…',
    detailsStep: 'Your details',
    detailsQuestion: 'Where should we send it?',
    detailsHint: 'A producer reviews your request and sends a tailored quotation within 48 hours.',
    fullName: 'Full name',
    company: 'Company or agency (optional)',
    email: 'Email',
    phone: 'Mobile',
    phonePlaceholder: '+971',
    contactMethodLabel: 'Best way to reach you',
    stepCounter: 'Step {current} of {total}',
    selectedCount: '{count} selected',
    noneSelected: 'Nothing selected',
    back: 'Back',
    next: 'Continue',
    submit: 'Request my quotation',
  },
  ar: {
    eyebrow: 'اطلب عرض سعر',
    heading: 'شاركنا رؤيتك، ونحن نتكفل بالتجهيز والتقنية والأجواء والنتائج.',
    description:
      'أخبرنا عن فعاليتك في أربع خطوات سريعة. يُسعَّر كل مشروع حسب تفاصيله، لذا يُعدّ أحد منتجينا عرض سعر مخصصاً ويرسله إليك خلال 48 ساعة.',
    basicsStep: 'أساسيات الفعالية',
    eventTypeQuestion: 'ما نوع الفعالية؟',
    cityQuestion: 'أين؟',
    dateLabel: 'تاريخ الفعالية',
    guestsLabel: 'عدد الضيوف المتوقع (اختياري)',
    guestsPlaceholder: 'مثلاً 250',
    boothsStep: 'البوثات',
    boothsQuestion: 'ما التجارب التي تبحث عنها؟',
    boothsHint: 'اختر ما تشاء، ويمكنك التعديل لاحقاً.',
    extrasStep: 'الإضافات',
    extrasQuestion: 'هل تريد إضافات؟',
    extrasHint: 'المشرف والتجهيز والمعرض الرقمي مشمولة دائماً.',
    notesLabel: 'هل هناك ما يجب أن نعرفه؟ (اختياري)',
    notesPlaceholder: 'المكان، الطابع، التوقيت، أو مرجع يعجبك…',
    detailsStep: 'بياناتك',
    detailsQuestion: 'إلى أين نرسل العرض؟',
    detailsHint: 'يراجع أحد منتجينا طلبك ويرسل عرض سعر مخصصاً خلال 48 ساعة.',
    fullName: 'الاسم الكامل',
    company: 'الشركة أو الوكالة (اختياري)',
    email: 'البريد الإلكتروني',
    phone: 'رقم الجوال',
    phonePlaceholder: '+971',
    contactMethodLabel: 'أفضل طريقة للتواصل معك',
    stepCounter: 'الخطوة {current} من {total}',
    selectedCount: 'تم اختيار {count}',
    noneSelected: 'لم يتم اختيار شيء',
    back: 'رجوع',
    next: 'متابعة',
    submit: 'اطلب عرض السعر',
  },
}

/** Fallback opt-in label for the quote form when the CMS leaves it empty. */
export const QUOTE_UPDATES_LABEL: Record<Locale, string> = {
  en: 'Send me ideas and new booth launches now and then. Unsubscribe any time.',
  ar: 'أرسلوا لي أفكاراً وإطلاقات البوثات الجديدة من حين لآخر. يمكنني إلغاء الاشتراك في أي وقت.',
}

export function defaultQuoteCopy(lang: Locale): QuoteCopy {
  return {
    ...QUOTE_STRINGS[lang],
    eventTypes: options(EVENT_TYPE_OPTIONS, lang),
    cities: options(CITY_OPTIONS, lang),
    booths: options(BOOTH_OPTIONS, lang),
    extras: options(EXTRA_OPTIONS, lang),
    contactMethods: options(CONTACT_METHOD_OPTIONS, lang),
  }
}

type FormConfig = NonNullable<FormConfigByKeyQueryResult>

/** Shallow merge that ignores null, blank strings and empty lists from the CMS. */
function withFallback<T extends object>(
  defaults: T,
  cms: Record<string, unknown> | null | undefined,
): T {
  if (!cms) return defaults
  const out = {...defaults} as Record<string, unknown>
  for (const [key, value] of Object.entries(cms)) {
    if (!(key in defaults)) continue
    if (Array.isArray(value)) {
      // Values feed the notification email, so they lose any visual-editing markers.
      const usable = value
        .filter((o): o is FormOption =>
          Boolean(o && typeof o.value === 'string' && o.value && o.label),
        )
        .map((o) => ({...o, value: stegaClean(o.value).trim()}))
      if (usable.length) out[key] = usable
    } else if (typeof value === 'string' && value.trim()) {
      out[key] = value
    }
  }
  return out as T
}

export const resolveContactCopy = (lang: Locale, cfg: FormConfig | null | undefined): ContactCopy =>
  withFallback(CONTACT_COPY[lang], cfg?.contactCopy)

export const resolveQuoteCopy = (lang: Locale, cfg: FormConfig | null | undefined): QuoteCopy =>
  withFallback(defaultQuoteCopy(lang), cfg?.quoteCopy)

/** Replaces `{name}` placeholders. */
export const fillTemplate = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match))

/** Behaviour settings shared by both forms (consent, opt-in, error text). */
export const resolveFormSettings = (cfg: FormConfig | null | undefined): FormSettings => ({
  errorText: cfg?.errorText ?? undefined,
  consentText: cfg?.consentText?.trim() || undefined,
  notificationsLabel: cfg?.notificationsLabel?.trim() || undefined,
  personalDataNote: cfg?.personalDataNote?.trim() || undefined,
})
