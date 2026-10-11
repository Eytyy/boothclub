import {at, defineMigration, set, setIfMissing, unset} from 'sanity/migrate'

/**
 * Team members: `firstName` + `lastName` become `name`, `picture` becomes `image`, `bio` goes.
 * About page: the `team` block moves out of `pageBuilder` into `teamSection`
 * (`heading` → `headline`), and the old `headline` field goes.
 *
 * Dry run:  npx sanity migration run simplify-team-members
 * Apply:    npx sanity migration run simplify-team-members --no-dry-run
 */

type LocalizedValue = {_key: string; _type?: string; language?: string; value?: string}

const languageOf = (item: LocalizedValue) => item.language ?? item._key

function joinNames(first: LocalizedValue[] = [], last: LocalizedValue[] = []) {
  return first
    .map((item) => {
      const language = languageOf(item)
      const lastName = last.find((other) => languageOf(other) === language)?.value
      const value = [item.value, lastName].filter(Boolean).join(' ').trim()
      return value ? {...item, value} : null
    })
    .filter(Boolean)
}

export default defineMigration({
  title: 'Simplify team members and move the About team block into its own field',
  documentTypes: ['teamMember', 'about'],

  migrate: {
    document(doc) {
      if (doc._type === 'teamMember') {
        const first = doc.firstName as LocalizedValue[] | undefined
        const last = doc.lastName as LocalizedValue[] | undefined
        if (!first && !last && !doc.picture && !doc.bio) return []

        const name = joinNames(first, last)
        return [
          ...(name.length ? [at('name', setIfMissing(name))] : []),
          ...(doc.picture ? [at('image', setIfMissing(doc.picture))] : []),
          at('firstName', unset()),
          at('lastName', unset()),
          at('picture', unset()),
          at('bio', unset()),
        ]
      }

      if (doc._type === 'about') {
        const blocks = (doc.pageBuilder ?? []) as Array<{_key: string; _type: string}>
        const teamBlocks = blocks.filter((block) => block._type === 'team') as Array<{
          _key: string
          heading?: unknown
          members?: unknown[]
        }>
        const mutations = []

        if (teamBlocks.length && !doc.teamSection) {
          const [first] = teamBlocks
          mutations.push(
            at(
              'teamSection',
              set({
                _type: 'team',
                ...(first.heading ? {headline: first.heading} : {}),
                members: first.members ?? [],
              }),
            ),
          )
        }
        for (const block of teamBlocks) {
          mutations.push(at(['pageBuilder', {_key: block._key}], unset()))
        }
        if (doc.headline !== undefined) mutations.push(at('headline', unset()))

        return mutations
      }

      return []
    },
  },
})
