import type {Locale} from './config'

/**
 * UI chrome that is not authored in the CMS. Keys are flat so they stay
 * serializable across the server/client boundary (see `LocalizedText.client`).
 */
const en = {
  'notFound.body':
    'The page you’re looking for doesn’t exist or has moved. Try one of these instead.',

  'thankYou.metaTitle': 'Thank you',
  'thankYou.metaDescription': 'Thanks for getting in touch — we have received your message.',
  'thankYou.title': 'Thank you',
  'thankYou.body': 'We’ve received your message and a member of our team will be in touch shortly.',

  'actions.viewOurWork': 'View our work',
  'actions.backToHome': 'Back to home',
  'actions.allWork': 'All work',
  'actions.joinTheTeam': 'Join the team',

  'language.switchToArabic': 'Switch to Arabic',
  'language.switchToEnglish': 'Switch to English',

  'sections.otherWork': 'Other Work',
  'sections.journal': 'Journal',

  'form.label.fullName': 'Full Name',
  'form.label.email': 'Email',
  'form.label.company': 'Company',
  'form.label.phone': 'Phone',
  'form.label.message': 'Got a specific booth in mind for your event? Let us know!',
  'form.label.notifications': 'I agree to receive notifications.',
  'form.label.consent': 'I consent to the processing of my personal data.',
  'form.label.submit': 'Submit',
  'form.label.submitting': 'Submitting...',

  'form.error.requiredName': 'Full name is required',
  'form.error.requiredMessage': 'Message is required',
  'form.error.email': 'Please enter a valid email address',
  'form.error.max120': 'Must be less than 120 characters',
  'form.error.min20': 'Must be at least 20 characters',
  'form.error.max5000': 'Must be less than 5000 characters',
  'form.error.consent': 'Please accept to continue',
  'form.error.generic': 'Something went wrong. Please try again later.',
  'form.error.invalidInput': 'Invalid input.',
  'form.error.verification': 'Verification failed. Please retry.',
  'form.error.unavailable': 'Service unavailable. Try again later.',

  'form.recaptcha.before': 'This site is protected by reCAPTCHA and the Google ',
  'form.recaptcha.privacyPolicy': 'Privacy Policy',
  'form.recaptcha.middle': ' and ',
  'form.recaptcha.terms': 'Terms of Service',
  'form.recaptcha.after': ' apply.',
} as const

export type DictionaryKey = keyof typeof en

export type Dictionary = Record<DictionaryKey, string>

const ar: Dictionary = {
  'notFound.body': 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها. جرّب أحد الخيارات التالية.',

  'thankYou.metaTitle': 'شكراً لك',
  'thankYou.metaDescription': 'شكراً لتواصلك معنا — لقد استلمنا رسالتك.',
  'thankYou.title': 'شكراً لك',
  'thankYou.body': 'لقد استلمنا رسالتك وسيتواصل معك أحد أعضاء فريقنا قريباً.',

  'actions.viewOurWork': 'شاهد أعمالنا',
  'actions.backToHome': 'العودة إلى الرئيسية',
  'actions.allWork': 'كل الأعمال',
  'actions.joinTheTeam': 'انضم إلى الفريق',

  'language.switchToArabic': 'التبديل إلى العربية',
  'language.switchToEnglish': 'التبديل إلى الإنجليزية',

  'sections.otherWork': 'أعمال أخرى',
  'sections.journal': 'المدونة',

  'form.label.fullName': 'الاسم الكامل',
  'form.label.email': 'البريد الإلكتروني',
  'form.label.company': 'الشركة',
  'form.label.phone': 'الهاتف',
  'form.label.message': 'أخبرنا عن مشروعك',
  'form.label.notifications': 'أوافق على تلقي الإشعارات.',
  'form.label.consent': 'أوافق على معالجة بياناتي الشخصية.',
  'form.label.submit': 'إرسال',
  'form.label.submitting': 'جارٍ الإرسال...',

  'form.error.requiredName': 'الاسم الكامل مطلوب',
  'form.error.requiredMessage': 'الرسالة مطلوبة',
  'form.error.email': 'يرجى إدخال بريد إلكتروني صالح',
  'form.error.max120': 'يجب أن يكون أقل من 120 حرفاً',
  'form.error.min20': 'يجب أن يكون 20 حرفاً على الأقل',
  'form.error.max5000': 'يجب أن يكون أقل من 5000 حرف',
  'form.error.consent': 'يرجى الموافقة للمتابعة',
  'form.error.generic': 'حدث خطأ ما. يرجى المحاولة مرة أخرى لاحقاً.',
  'form.error.invalidInput': 'مدخلات غير صالحة.',
  'form.error.verification': 'فشل التحقق. يرجى إعادة المحاولة.',
  'form.error.unavailable': 'الخدمة غير متوفرة. حاول مرة أخرى لاحقاً.',

  'form.recaptcha.before': 'هذا الموقع محمي بواسطة reCAPTCHA وتنطبق عليه ',
  'form.recaptcha.privacyPolicy': 'سياسة الخصوصية',
  'form.recaptcha.middle': ' و',
  'form.recaptcha.terms': 'شروط الخدمة',
  'form.recaptcha.after': ' الخاصة بـ Google.',
}

const dictionaries: Record<Locale, Dictionary> = {en, ar}

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang]
}
