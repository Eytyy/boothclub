type SpecItem = {
  _key: string
  text: string
}

type SpecsBlockProps = {
  items?: SpecItem[]
}

export default function SpecsBlock({items}: SpecsBlockProps) {
  if (!items?.length) return null

  return (
    <ul className="text-3xl font-bold">
      {items.map((item, index) => (
        <li className="p-10 border-b-4 border-black dark:border-white" key={item._key}>
          <span className="rounded-full bg-black dark:bg-white p-2 w-10 h-10 inline-flex items-center justify-center text-4xl font-bold text-white dark:text-black">
            {index + 1}
          </span>{' '}
          <span className="">{item.text}</span>
        </li>
      ))}
    </ul>
  )
}
