export type ParallaxPreset = {
  speed: [number, number]
  offsetPx: number
}

export type ParallaxVariant = 'staggered-6col' | 'flowing'

const STAGGERED_SM: ParallaxPreset[] = [
  {speed: [25, -15], offsetPx: 40},
  {speed: [50, -25], offsetPx: 0},
  {speed: [80, -40], offsetPx: 20},
]

const STAGGERED_2XL: ParallaxPreset[] = [
  {speed: [65, -35], offsetPx: 0},
  {speed: [160, -100], offsetPx: 200},
  {speed: [130, -80], offsetPx: 40},
]

const FLOWING_SM: ParallaxPreset[] = [
  {speed: [35, -12], offsetPx: 0},
  {speed: [60, -24], offsetPx: 24},
  {speed: [45, -16], offsetPx: 8},
  {speed: [70, -32], offsetPx: 32},
  {speed: [50, -18], offsetPx: 0},
  {speed: [80, -38], offsetPx: 20},
]

const FLOWING_2XL: ParallaxPreset[] = [
  {speed: [80, -35], offsetPx: 0},
  {speed: [135, -65], offsetPx: 80},
  {speed: [110, -48], offsetPx: 24},
  {speed: [170, -80], offsetPx: 120},
  {speed: [100, -45], offsetPx: 0},
  {speed: [150, -70], offsetPx: 64},
]

export function getPresetTable(variant: ParallaxVariant, is2xl: boolean): ParallaxPreset[] {
  return variant === 'staggered-6col'
    ? is2xl ? STAGGERED_2XL : STAGGERED_SM
    : is2xl ? FLOWING_2XL : FLOWING_SM
}

export function getParallaxPreset(variant: ParallaxVariant, index: number, is2xl: boolean): ParallaxPreset {
  const table = getPresetTable(variant, is2xl)
  return table[index % table.length]!
}

/**
 * Returns the effective footer parallax speed for a grid.
 *
 * Finds the last-row item with the largest total visual displacement
 * (speed + offsetPx), then subtracts the row's max offsetPx because
 * the grid layout already pushes the footer below the tallest padded item.
 */
export function getFooterParallaxSpeed(
  variant: ParallaxVariant,
  itemCount: number,
  cols: number,
  is2xl: boolean,
): [number, number] {
  const table = getPresetTable(variant, is2xl)
  const remainder = itemCount % cols
  const lastRowStart = itemCount - (remainder || cols)

  let maxOffset = 0
  let lowestPreset = table[lastRowStart % table.length]!
  let lowestTotal = lowestPreset.speed[0] + lowestPreset.offsetPx

  for (let i = lastRowStart; i < itemCount; i++) {
    const preset = table[i % table.length]!
    if (preset.offsetPx > maxOffset) maxOffset = preset.offsetPx
    const total = preset.speed[0] + preset.offsetPx
    if (total > lowestTotal) {
      lowestTotal = total
      lowestPreset = preset
    }
  }

  const adjust = lowestPreset.offsetPx - maxOffset
  return [
    lowestPreset.speed[0] + adjust,
    lowestPreset.speed[1] + adjust,
  ]
}