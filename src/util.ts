export const range = function* (
  from: number,
  to = 0,
  step = 1
): IterableIterator<number> {
  let i = 0
  const length = Math.floor((to - from) / step) + 1
  while (i < length) yield from + i++ * step
}
