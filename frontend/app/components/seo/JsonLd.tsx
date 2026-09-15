type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

// Renders one or more JSON-LD structured-data scripts. The `<` escaping guards
// against breaking out of the <script> context if any field contains markup.
export default function JsonLd({data}: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data]

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
