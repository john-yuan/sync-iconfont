import fs from 'fs'
import path from 'path'
import { resolveIconFontCss } from './core/resolveIconFontCss'
import { downloadFile } from './core/downloadFile'

export interface SyncIconFontOptions {
  /**
   * IconFont css 文件地址，如：
   *
   * - `//at.alicdn.com/t/c/xxx.css`
   * - `https://at.alicdn.com/t/c/xxx.css`
   */
  cssUrl: string

  /**
   * 输出目录。
   *
   * 默认值: `'iconfont'`
   */
  outputDir?: string

  /**
   * 文件名，程序会基于此名称生成 css 文件和字体文件的名称，不能包含目录和后缀。
   *
   * 默认值: `'iconfont'`
   */
  filename?: string

  /**
   * 指定一个路径，用于保存生成的 TypeScript 类型文件。
   *
   * 如果指定为 false，则不生成 TypeScript 类型文件。
   * 如果未指定路径，默认为 `{outputDir}/{filename}.ts`。
   */
  typeOutputPath?: string | false

  /**
   * 指定生成的 Typescript 类型的名称，默认为 `IconFontName`。
   */
  typeName?: string

  /**
   * FontClass 前缀，如果指定了前缀，会在生成 TypeScript 类型时移除此前缀。
   */
  fontClassPrefix?: string
}

export async function syncIconFont(options: SyncIconFontOptions) {
  const url = options.cssUrl.startsWith('//')
    ? 'https:' + options.cssUrl
    : options.cssUrl

  const logger = (message: string) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`)
  }

  logger(`downloading ${url}`)

  const css = await fetch(url).then((res) => res.text())

  logger(`downloaded ${url}`)

  const res = resolveIconFontCss(css)
  const outputDir = path.resolve(options.outputDir || 'iconfont')
  const filename = options.filename || 'iconfont'

  fs.mkdirSync(outputDir, { recursive: true })

  const downloadFont = async (url: string, timestamp: string) => {
    const ext = url.split('?')[0].split('.').pop() || ''
    const fontFileName = filename + '.' + ext
    const fontOutputPath = path.resolve(outputDir, fontFileName)
    logger(`downloading ${url}`)
    return downloadFile(url, fontOutputPath).then(() => {
      logger(`saved ` + path.relative(process.cwd(), fontOutputPath))
      return `url('./${fontFileName}?t=${timestamp}')`
    })
  }

  const fontSrcList: string[] = []

  for (const font of res.fonts) {
    const fontSrc = await downloadFont(font.url, res.timestamp)
    fontSrcList.push(fontSrc + ' ' + font.format)
  }

  const cssStart = css.slice(0, res.srcStartIndex)
  const cssEnd = css.slice(res.srcEndIndex)
  const newCss = cssStart + 'src: ' + fontSrcList.join(',\n    ') + cssEnd
  const cssOutputPath = path.resolve(outputDir, filename + '.css')

  fs.writeFileSync(cssOutputPath, newCss)

  logger(`saved ` + path.relative(process.cwd(), cssOutputPath))

  const ts =
    `export type ${options.typeName || 'IconFontName'} = ` +
    res.iconClassNames
      .sort()
      .map((name) =>
        options.fontClassPrefix && name.startsWith(options.fontClassPrefix)
          ? name.slice(options.fontClassPrefix.length)
          : name
      )
      .map((name) => (name.includes(`'`) ? JSON.stringify(name) : `'${name}'`))
      .join('\n  | ') +
    '\n'

  if (options.typeOutputPath != false) {
    const typeOutputPath =
      options.typeOutputPath == null
        ? path.resolve(outputDir, filename + '.ts')
        : path.resolve(options.typeOutputPath)

    fs.writeFileSync(typeOutputPath, ts)

    logger(`saved ` + path.relative(process.cwd(), typeOutputPath))
  }
}
