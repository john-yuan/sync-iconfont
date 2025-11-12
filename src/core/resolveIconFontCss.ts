export function resolveIconFontCss(css: string) {
  const srcStartIndex = css.indexOf('src:')
  const srcEndIndex = css.indexOf(';', srcStartIndex)
  const fonts = css
    .slice(srcStartIndex + 4, srcEndIndex)
    .trim()
    .split(',')
    .map((line) => {
      const arr = line.trim().split(/\s+/)
      const url = (arr[0] || '').slice(5, -2)
      const format = (arr[1] || '').replace(/\)[^)]*$/, ')')
      return { url: url.startsWith('//') ? 'https:' + url : url, format }
    })

  const timestamp =
    fonts[0]?.url.split('?')[1]?.split('=')[1] ?? Date.now().toString()

  const iconClassNames: string[] = []

  css.replace(/\.(.+):before\s*{/g, (s, name) => {
    iconClassNames.push(name)
    return s
  })

  return {
    srcStartIndex,
    srcEndIndex,
    timestamp,
    fonts,
    iconClassNames
  }
}
