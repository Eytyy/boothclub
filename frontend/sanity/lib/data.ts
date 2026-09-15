import type {Locale} from '@/app/lib/i18n/config'
import {sanityFetch} from '@/sanity/lib/live'
import {formConfigByKeyQuery} from '@/sanity/lib/queries'
import type {FormConfigByKeyQueryResult} from '@/sanity.types'

export async function fetchFormConfigByKey(
  key: string,
  lang: Locale,
): Promise<FormConfigByKeyQueryResult | null> {
  try {
    const {data} = await sanityFetch({
      query: formConfigByKeyQuery,
      params: {key, lang},
      stega: false,
    })
    return data ?? null
  } catch (e) {
    console.error('Error fetching form config:', e)
    return null
  }
}

