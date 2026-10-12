import {stegaClean} from '@sanity/client/stega'

import {cn} from '@/app/lib/utils'
import TextReveal from '@/app/components/ui/TextReveal.client'

type Step = {_key: string; title: string | null; body: string | null}

const COLUMNS: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

/** "What happens next": a numbered strip, one ruled cell per step. */
export default function ProcessSteps({steps}: {steps: Step[]}) {
  const items = steps.filter((s): s is Step & {title: string} => Boolean(s.title))
  if (!items.length) return null

  return (
    <ol className={cn('grid grid-cols-1', COLUMNS[items.length] ?? 'lg:grid-cols-4')}>
      {items.map((step, index) => (
        <li
          key={step._key}
          className="p-5 lg:p-10 space-y-5 border-b-site last:border-b-0 lg:border-b-0 lg:border-e-site lg:last:border-e-0 border-black dark:border-white"
        >
          <span aria-hidden className="block text-sm font-semibold uppercase tracking-wide">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3>
            <TextReveal variant="compact" text={stegaClean(step.title)} />
          </h3>
          {step.body ? <p className="body-text">{step.body}</p> : null}
        </li>
      ))}
    </ol>
  )
}
