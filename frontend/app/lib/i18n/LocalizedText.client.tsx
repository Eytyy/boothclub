'use client'

import type {DictionaryKey} from './dictionary'
import {useDictionary} from './LocaleProvider.client'

/**
 * Renders a dictionary string for the active locale. Use this from components
 * that render without access to the route's `lang` param; anything that can
 * reach `lang` should call `getDictionary` directly.
 */
export default function LocalizedText({k}: {k: DictionaryKey}) {
  return useDictionary()[k]
}
