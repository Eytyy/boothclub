import {defaultLocale, localizedPath, type Locale} from '@/app/lib/i18n/config'

// Homepage structured data (JSON-LD) for Organization + LocalBusiness.
//
// Values originate from the SEO audit document. They are low-churn business
// facts (NAP, founding date, services) so they live here as typed constants
// rather than being modelled in Sanity. Anything that should be verified with
// the client is flagged inline; see docs/seo-consultant-review.md.

const DEFAULT_SITE_URL = 'https://www.boothclub.com'

// TODO(seo): confirm this is the correct public-facing logo. The audit supplied
// a 1200x630 OG-style image; Google rich results prefer a square brand logo.
const LOGO_URL =
  'https://cdn.sanity.io/images/0oukgjtm/production/9a1a0d021327161327b51caf54086f89359819a2-1200x630.jpg'

// TODO(seo): confirm contact email domain (audit used info@katchthis.com, which
// differs from the boothclub.com site domain).
const CONTACT_EMAIL = 'info@katchthis.com'

const SOCIAL_PROFILES = [
  'https://www.facebook.com/KatchInternational',
  'https://www.instagram.com/katch_int/',
  'https://x.com/katchintl',
  'https://www.linkedin.com/company/katch-international/',
]

const SERVICES: {name: string; slug: string}[] = [
  {name: 'Public Relations', slug: 'public-relations'},
  {name: 'Strategic Consultancy', slug: 'strategic-consultancy'},
  {name: 'Social Media', slug: 'social-media'},
  {name: 'Branding & Design', slug: 'branding-and-design'},
  {name: 'Content Creation', slug: 'content-creation'},
  {name: 'Research & Copywriting', slug: 'research-and-copywriting'},
]

function normalizeBaseUrl(siteUrl?: string): string {
  const raw = siteUrl?.trim() || DEFAULT_SITE_URL
  return raw.replace(/\/+$/, '')
}

function buildOfferCatalog(baseUrl: string, lang: Locale) {
  return {
    '@type': 'OfferCatalog',
    'name': 'Agency Services',
    'itemListElement': SERVICES.map((service) => ({
      '@type': 'Offer',
      'itemOffered': {
        '@type': 'Service',
        'name': service.name,
        'url': `${baseUrl}${localizedPath(lang, `/products/${service.slug}`)}`,
      },
    })),
  }
}

export function buildOrganizationSchema(
  siteUrl?: string,
  lang: Locale = defaultLocale,
): Record<string, unknown> {
  const baseUrl = normalizeBaseUrl(siteUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Katch International',
    'alternateName': 'Katch PR',
    'url': baseUrl,
    'foundingDate': '2010',
    'email': CONTACT_EMAIL,
    'slogan': "We don't just tell stories. We make them impossible to ignore.",
    'description':
      'Leading storytelling and cultural transformation agency delivering PR, social media, branding, strategic consultancy, content creation, and research & copywriting for global brands. Offices in Dubai, London, and Riyadh.',
    'image': LOGO_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': LOGO_URL,
      'width': 1200,
      'height': 630,
    },
    'sameAs': SOCIAL_PROFILES,
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': '+97145727540',
        'contactType': 'customer service',
        'areaServed': 'AE',
        'availableLanguage': ['English', 'Arabic'],
      },
      {
        '@type': 'ContactPoint',
        'telephone': '+442088956383',
        'contactType': 'customer service',
        'areaServed': 'GB',
        'availableLanguage': 'English',
      },
      {
        '@type': 'ContactPoint',
        'telephone': '+966502263793',
        'contactType': 'customer service',
        'areaServed': 'SA',
        'availableLanguage': ['English', 'Arabic'],
      },
    ],
    'hasOfferCatalog': buildOfferCatalog(baseUrl, lang),
    'areaServed': [
      {'@type': 'Country', 'name': 'United Arab Emirates'},
      {'@type': 'Country', 'name': 'United Kingdom'},
      {'@type': 'Country', 'name': 'Saudi Arabia'},
    ],
  }
}

export function buildLocalBusinessSchema(
  siteUrl?: string,
  lang: Locale = defaultLocale,
): Record<string, unknown> {
  const baseUrl = normalizeBaseUrl(siteUrl)

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Katch International',
    'url': baseUrl,
    'image': LOGO_URL,
    'logo': LOGO_URL,
    'email': CONTACT_EMAIL,
    'telephone': '+97145727540',
    'priceRange': '$$',
    'foundingDate': '2010',
    'description':
      'Leading PR, branding, social media and strategic consultancy agency headquartered in Dubai, serving global brands across the UAE and beyond.',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '2004, Tameem House, Barsha Heights',
      'addressLocality': 'Dubai',
      // TODO(seo): confirm postal code with client.
      'postalCode': '122321',
      'addressRegion': 'Dubai',
      'addressCountry': 'AE',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      // TODO(seo): confirm coordinates with client.
      'latitude': 25.0966,
      'longitude': 55.1764,
    },
    'hasMap': 'https://maps.google.com/?q=Tameem+House+Barsha+Heights+Dubai',
    'sameAs': SOCIAL_PROFILES,
    'hasOfferCatalog': buildOfferCatalog(baseUrl, lang),
  }
}

export function buildHomeStructuredData(
  siteUrl?: string,
  lang: Locale = defaultLocale,
): Record<string, unknown>[] {
  return [buildOrganizationSchema(siteUrl, lang), buildLocalBusinessSchema(siteUrl, lang)]
}
