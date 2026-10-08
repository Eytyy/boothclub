'use client'
import * as React from 'react'
import {cn} from '@/app/lib/utils'
import Button from '@/app/components/ui/Button'
import TextReveal from '@/app/components/ui/TextReveal.client'

/**
 * Mock-up of the multi-step "Get a quote" flow. Answers are kept in local state
 * only; nothing is submitted. Pricing is case by case (B2B), so the flow ends on
 * a confirmation — no estimate is shown on the site.
 */

const EVENT_TYPES = ['Brand activation', 'Retail launch', 'Corporate', 'Wedding', 'Private party']
const CITIES = ['Dubai', 'Abu Dhabi', 'Riyadh', 'Elsewhere in GCC']
const BOOTHS = [
  {label: 'Glambot', note: 'Slow-motion video, robotic camera arm'},
  {label: 'AI Booth', note: 'Portraits in your campaign look'},
  {label: 'Aura Booth', note: 'Colour-aura portraits'},
  {label: 'Scribble Booth', note: 'Guests draw on their photos'},
  {label: 'Classic Booth', note: 'Instant prints and GIFs'},
  {label: 'Mirror & Neon Tunnels', note: 'Walk-in sets for group shots'},
  {label: 'Custom Build', note: 'Designed around your brand'},
  {label: 'Not sure yet', note: 'We’ll recommend one for you'},
]
const EXTRAS = [
  {label: 'Branded booth shell', note: 'Wrapped in your artwork and colours'},
  {label: 'Custom overlays & AI styles', note: 'Frames, filters and looks designed for the event'},
  {label: 'Sharing microsite', note: 'Guests get their photos by QR, email or WhatsApp'},
  {label: 'Data capture', note: 'Opt-in sign-ups, with a report after'},
  {label: 'Extra hours', note: 'Beyond the standard package'},
]
const CONTACT_METHODS = ['WhatsApp', 'Email', 'Phone call']
const STEPS = ['Event basics', 'Booths', 'Extras', 'Your details']

type Answers = {
  eventType: string
  city: string
  date: string
  guests: string
  booths: string[]
  extras: string[]
  notes: string
  fullName: string
  company: string
  email: string
  phone: string
  contactMethod: string
  updates: boolean
}

const INITIAL: Answers = {
  eventType: EVENT_TYPES[0],
  city: CITIES[0],
  date: '',
  guests: '',
  booths: [],
  extras: [],
  notes: '',
  fullName: '',
  company: '',
  email: '',
  phone: '',
  contactMethod: CONTACT_METHODS[0],
  updates: false,
}

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

export default function QuoteFlow({className}: {className?: string}) {
  const [step, setStep] = React.useState(0)
  const [sent, setSent] = React.useState(false)
  const [a, setA] = React.useState<Answers>(INITIAL)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setA((prev) => ({...prev, [key]: value}))

  const go = (next: number) => {
    setStep(next)
    panelRef.current?.focus()
  }

  const last = STEPS.length - 1

  const reset = () => {
    setA(INITIAL)
    setSent(false)
    go(0)
  }

  return (
    <section className={cn('grid lg:grid-cols-2', className)} aria-labelledby="quote-title">
      <div className="p-5 lg:p-10 space-y-5">
        <p className="text-sm font-semibold uppercase tracking-wide">Get a quote</p>
        <h2 id="quote-title" className="sr-only">
          Get an instant quotation within 48 hours
        </h2>
        <TextReveal
          className="text-reveal-default"
          text="Tell us the vision, we bring the setup, the tech, the vibe and the results."
        />
        <p className="body-text max-w-150">
          Tell us about your event in four quick steps. Every project is priced case by case, so a
          producer prepares a tailored quotation and sends it within 48 hours. Prefer to talk?
          WhatsApp us or call +971 4 313 5196.
        </p>
      </div>

      <div className="border-t-site lg:border-t-0 lg:border-s-site border-black dark:border-white">
        <div
          ref={panelRef}
          tabIndex={-1}
          className="p-5 lg:p-10 space-y-10 focus:outline-none"
          aria-live="polite"
        >
          {sent ? (
            <StepConfirmation a={a} onReset={reset} />
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold uppercase tracking-wide">
                  <span>
                    Step {step + 1} of {STEPS.length}
                  </span>
                  <span>{STEPS[step]}</span>
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={STEPS.length}
                  aria-valuenow={step + 1}
                  aria-label="Quote progress"
                  className="h-1 bg-black/20 dark:bg-white/20"
                >
                  <div
                    className="h-full bg-black dark:bg-white transition-[width]"
                    style={{width: `${((step + 1) / STEPS.length) * 100}%`}}
                  />
                </div>
              </div>

              {step === 0 && <StepBasics a={a} set={set} />}
              {step === 1 && <StepBooths a={a} set={set} />}
              {step === 2 && <StepExtras a={a} set={set} />}
              {step === 3 && <StepDetails a={a} set={set} />}

              <div className="flex items-center justify-between gap-5">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className="text-lg font-medium hover:underline"
                  >
                    ← Back
                  </button>
                ) : (
                  <span className="text-sm hidden sm:block">Next: {STEPS[1].toLowerCase()}</span>
                )}
                <div className="flex items-center gap-5">
                  {step === 1 && (
                    <span className="text-sm">
                      {a.booths.length === 0 ? 'Nothing selected' : `${a.booths.length} selected`}
                    </span>
                  )}
                  <Button
                    type="button"
                    onClick={() => (step === last ? setSent(true) : go(step + 1))}
                  >
                    {step === last ? 'Request my quotation' : 'Continue'} <span aria-hidden>→</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

type StepProps = {
  a: Answers
  set: <K extends keyof Answers>(key: K, value: Answers[K]) => void
}

const StepHeading = ({title, hint}: {title: string; hint?: string}) => (
  <div className="space-y-2">
    <h3 className="text-2xl font-semibold">{title}</h3>
    {hint ? <p>{hint}</p> : null}
  </div>
)

const chipClass = (on: boolean) =>
  cn(
    'border-2 border-black dark:border-white px-5 py-2 text-lg transition-colors',
    on
      ? 'bg-black text-white dark:bg-white dark:text-black'
      : 'hover:bg-black/10 dark:hover:bg-white/10',
  )

const ChipGroup = ({
  options,
  value,
  onPick,
  label,
}: {
  options: string[]
  value: string
  onPick: (v: string) => void
  label: string
}) => (
  <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-3">
    {options.map((o) => (
      <button
        key={o}
        type="button"
        role="radio"
        aria-checked={value === o}
        onClick={() => onPick(o)}
        className={chipClass(value === o)}
      >
        {o}
      </button>
    ))}
  </div>
)

const underlineField =
  'block w-full border-0 border-b border-gray-300 bg-transparent rounded-none py-2 placeholder-gray-400 focus:border-primary-foreground focus:outline-none focus:ring-0'

const TextField = ({
  id,
  label,
  className,
  ...props
}: {label: string} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <label htmlFor={id} className="font-medium text-lg">
      {label}
    </label>
    <input id={id} className={underlineField} {...props} />
  </div>
)

function StepBasics({a, set}: StepProps) {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <StepHeading title="What kind of event?" />
        <ChipGroup
          label="Event type"
          options={EVENT_TYPES}
          value={a.eventType}
          onPick={(v) => set('eventType', v)}
        />
      </div>
      <div className="space-y-4">
        <StepHeading title="Where?" />
        <ChipGroup label="City" options={CITIES} value={a.city} onPick={(v) => set('city', v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-10">
        <TextField
          id="quote-date"
          label="Event date"
          type="date"
          value={a.date}
          onChange={(e) => set('date', e.target.value)}
        />
        <TextField
          id="quote-guests"
          label="Expected guests"
          type="number"
          inputMode="numeric"
          min={1}
          placeholder="e.g. 250"
          value={a.guests}
          onChange={(e) => set('guests', e.target.value)}
        />
      </div>
    </div>
  )
}

function StepBooths({a, set}: StepProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Which experiences are you after?"
        hint="Pick as many as you like. You can change this later."
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {BOOTHS.map((b) => {
          const on = a.booths.includes(b.label)
          return (
            <button
              key={b.label}
              type="button"
              aria-pressed={on}
              onClick={() => set('booths', toggle(a.booths, b.label))}
              className={cn(
                'flex items-start justify-between gap-3 border-2 border-black dark:border-white p-4 text-start transition-colors',
                on
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'hover:bg-black/10 dark:hover:bg-white/10',
              )}
            >
              <span className="space-y-1">
                <span className="block text-lg font-semibold">{b.label}</span>
                <span className="block text-sm">{b.note}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-2 text-xs',
                  on ? 'border-white dark:border-black' : 'border-black dark:border-white',
                )}
              >
                {on ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepExtras({a, set}: StepProps) {
  return (
    <div className="space-y-6">
      <StepHeading
        title="Anything on top?"
        hint="An attendant, setup and a digital gallery are always included."
      />
      <div>
        {EXTRAS.map((x) => {
          const on = a.extras.includes(x.label)
          return (
            <button
              key={x.label}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => set('extras', toggle(a.extras, x.label))}
              className="flex w-full items-center justify-between gap-5 border-t border-black/30 dark:border-white/30 py-4 text-start"
            >
              <span className="space-y-1">
                <span className="block text-lg font-medium">{x.label}</span>
                <span className="block text-sm">{x.note}</span>
              </span>
              <span
                aria-hidden
                className={cn(
                  'flex h-6.5 w-11 shrink-0 items-center border-2 border-black dark:border-white p-0.5 transition-colors',
                  on ? 'justify-end bg-black dark:bg-white' : 'justify-start',
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4',
                    on ? 'bg-white dark:bg-black' : 'bg-black dark:bg-white',
                  )}
                />
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="quote-notes" className="font-medium text-lg">
          Anything else we should know? (optional)
        </label>
        <textarea
          id="quote-notes"
          rows={3}
          placeholder="Venue, theme, timings, a reference you love…"
          className={underlineField}
          value={a.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </div>
    </div>
  )
}

function StepDetails({a, set}: StepProps) {
  return (
    <div className="space-y-10">
      <StepHeading
        title="Where should we send it?"
        hint="A producer reviews your request and sends a tailored quotation within 48 hours."
      />
      <div className="grid sm:grid-cols-2 gap-10">
        <TextField
          id="quote-name"
          label="Full name"
          autoComplete="name"
          value={a.fullName}
          onChange={(e) => set('fullName', e.target.value)}
        />
        <TextField
          id="quote-company"
          label="Company or agency (optional)"
          autoComplete="organization"
          value={a.company}
          onChange={(e) => set('company', e.target.value)}
        />
        <TextField
          id="quote-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={a.email}
          onChange={(e) => set('email', e.target.value)}
        />
        <TextField
          id="quote-phone"
          label="Mobile"
          type="tel"
          autoComplete="tel"
          placeholder="+971"
          value={a.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <p className="font-medium text-lg">Best way to reach you</p>
        <ChipGroup
          label="Best way to reach you"
          options={CONTACT_METHODS}
          value={a.contactMethod}
          onPick={(v) => set('contactMethod', v)}
        />
      </div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1.5 h-4 w-4 shrink-0 accent-black dark:accent-white"
          checked={a.updates}
          onChange={(e) => set('updates', e.target.checked)}
        />
        <span>Send me ideas and new booth launches now and then. Unsubscribe any time.</span>
      </label>
    </div>
  )
}

function StepConfirmation({a, onReset}: {a: Answers; onReset: () => void}) {
  const rows: [string, string][] = [
    [
      'Event',
      [a.eventType, a.city, a.date || '[date]', a.guests ? `${a.guests} guests` : '[guests]'].join(
        ' · ',
      ),
    ],
    ['Booths', a.booths.length ? a.booths.join(', ') : '[none selected]'],
    ['Extras', a.extras.length ? a.extras.join(', ') : '[none selected]'],
    ['Contact', `${a.contactMethod} · ${a.phone || a.email || '[contact]'}`],
  ]

  return (
    <div className="space-y-10">
      <p className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-5 w-5 shrink-0 items-center justify-center bg-black text-xs text-white dark:bg-white dark:text-black"
        >
          ✓
        </span>
        Request received.
      </p>

      <div className="space-y-2">
        <h3 className="text-2xl font-semibold">Your quotation is on its way.</h3>
        <p>
          A producer will review your request and send a tailored quotation by{' '}
          {a.contactMethod.toLowerCase()} within 48 hours.
        </p>
      </div>

      <dl>
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex justify-between gap-5 border-t border-black/30 dark:border-white/30 py-4"
          >
            <dt className="font-medium">{k}</dt>
            <dd className="text-end">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-5">
        <Button href="/contact">Need it sooner? Chat with a producer</Button>
        <button type="button" onClick={onReset} className="text-lg font-medium hover:underline">
          Start another request
        </button>
      </div>
    </div>
  )
}
