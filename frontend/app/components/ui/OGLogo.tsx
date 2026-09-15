import {logoPaths, logoViewBox} from '@/app/components/ui/logoPaths'

export default function OGLogo() {
  return (
    <svg width="595" height="137" viewBox={logoViewBox} fill="none">
      {[...logoPaths].reverse().map((d, index) => (
        <path key={index} d={d} fill="#231F20" />
      ))}
    </svg>
  )
}
