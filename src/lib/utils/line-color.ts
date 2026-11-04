export const LINE_COLORS = [
  "cobalt",
  "viridian",
  "ochre",
  "vermilion",
  "plum",
  "sky",
] as const

export type LineColor = (typeof LINE_COLORS)[number]

// Lines are handed out in order: two repositories can then only share a colour
// past the sixth one.
export const assignLineColors = (names: string[]): Map<string, LineColor> =>
  new Map(
    [...new Set(names)]
      .sort()
      .map((name, index) => [name, LINE_COLORS[index % LINE_COLORS.length]])
  )
