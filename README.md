# README

[![npm version](https://img.shields.io/npm/v/sync-iconfont.svg)](https://www.npmjs.com/package/sync-iconfont)

本项目用于同步 iconfont CSS 文件和字体文件。

功能：

- 拉取最新 CSS 文件和字体文件到本地。
- 自动替换 CSS 文件中 `@font-face` 的 `src` 路径。
- 替换或删除 `font-size` 设置。
- 生成图标名称 TypeScript 类型。

## 安装

```sh
npm i sync-iconfont --save-dev
```

## 使用方式

首次使用时需添加配置文件 `.iconfont.yml`，内容如下：

```yml
# IconFont css 文件地址
cssUrl: //at.alicdn.com/t/c/xxx.css

# FontClass 前缀
# 如果指定了前缀，会在生成 TypeScript 类型时移除此前缀
# fontClassPrefix:

# 输出目录，默认为 iconfont
# outputDir: iconfont

# 文件名，程序会基于此名称生成 css 文件和字体文件的名称
# 不能包含目录和后缀，默认为 iconfont
# filename: iconfont

# 指定一个路径，用于保存生成的 TypeScript 类型文件
# 如果指定为 false，则不生成 TypeScript 类型文件
# 如果未指定路径，默认为 `{outputDir}/{filename}.ts`
# typeOutputPath:

# 指定生成的 TypeScript 类型的名称，默认为 IconFontName
# typeName: IconFontName

# 字体大小设置
# 如果设置为 false 则移除 font-size
# 如果设置为字符串如 1em 则替换为对应值
# 如果不设置，则保留原有值
# fontSize:
```

然后在 `.iconfont.yml` 同级目录下执行命令：

```sh
npx sync-iconfont
```

## API

```ts
import { syncIconFont } from 'sync-iconfont'

syncIconFont({
  cssUrl: '//at.alicdn.com/t/c/xxx.css'
})
```

## License

[MIT](./LICENSE)
