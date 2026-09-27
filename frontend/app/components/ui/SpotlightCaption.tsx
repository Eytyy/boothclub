type SpotlightCaptionProps = {
  title: string
  detail?: string | null
}

export default function SpotlightCaption({title, detail}: SpotlightCaptionProps) {
  return (
    <div>
      <h3 className="text-3xl font-semibold leading-tight">{title}</h3>
      {detail ? (
        <span className="shrink-0 text-base text-black/60 dark:text-white/60">{detail}</span>
      ) : null}
    </div>
  )
}
