import {useFormValue, type Path, type StringInputProps} from 'sanity'

type SectionBlock = {
  _key?: string
  span?: string
}

type Section = {
  columns?: string
  blocks?: SectionBlock[]
}

export function findSectionColumns(document: unknown, blockKey: string | undefined): string | undefined {
  if (!blockKey || !document || typeof document !== 'object') {
    return undefined
  }

  const body = (document as {body?: unknown}).body
  if (!Array.isArray(body)) {
    return undefined
  }

  for (const section of body as Section[]) {
    const blocks = section?.blocks
    if (!Array.isArray(blocks)) {
      continue
    }
    if (blocks.some((block) => block?._key === blockKey)) {
      return section.columns
    }
  }

  return undefined
}

function spanListForColumns(columns: string | undefined) {
  if (columns === '2') {
    return [
      {title: 'Half', value: '1'},
      {title: 'Full', value: 'full'},
    ]
  }

  return [
    {title: 'One column', value: '1'},
    {title: 'Two columns', value: '2'},
    {title: 'Full width', value: 'full'},
  ]
}

function blockKeyFromSpanPath(path: Path): string | undefined {
  const item = path[path.length - 2]
  if (item && typeof item === 'object' && '_key' in item) {
    return (item as {_key: string})._key
  }
  return undefined
}

export function PostBlockSpanInput(props: StringInputProps) {
  const document = useFormValue([])
  const columns = findSectionColumns(document, blockKeyFromSpanPath(props.path))
  const value = columns === '2' && props.value === '2' ? 'full' : props.value

  return props.renderDefault({
    ...props,
    value,
    schemaType: {
      ...props.schemaType,
      description:
        columns === '2'
          ? 'Half sits in one of the two columns. Full spans the row.'
          : 'How much of this section this block occupies.',
      options: {
        ...props.schemaType.options,
        list: spanListForColumns(columns),
        layout: 'radio',
      },
    },
  })
}
