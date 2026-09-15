import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {productPath} from '@/app/lib/product/paths'

type Product = {
  _id: string
  title?: string | null
  slug?: string | null
  category?: {slug?: string | null} | null
}

export default function ProjectMeta({products}: {products: Product[] | null | undefined}) {
  const list = products ?? []

  if (list.length === 0) return null

  return (
    <section className="grid gap-5 lg:gap-10 mb-4 lg:mb-0">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
          Products
        </p>
        <ul className="grid lg:grid-cols-2 gap-5 md:gap-10">
          {list.map((product) => (
            <li key={product._id}>
              {product.slug && product.category?.slug ? (
                <LocalizedLink
                  href={productPath(product.category.slug, product.slug)}
                  className="text-sm lg:text-lg font-medium hover:underline"
                >
                  {product.title}
                </LocalizedLink>
              ) : (
                <p className="text-sm lg:text-lg font-medium">{product.title}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
