import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import { syncIconFont, type SyncIconFontOptions } from '.'

function readConfig(filename: string) {
  if (fs.existsSync(filename)) {
    return fs.readFileSync(path.resolve(process.cwd(), filename)).toString()
  }
  return ''
}

const config = yaml.parse(
  readConfig('.iconfont.yml') || readConfig('.iconfont.yaml')
) as SyncIconFontOptions

if (!config) {
  console.error(
    'error: config file (.iconfont.yml or .iconfont.yaml) is not found or it is empty.'
  )
  process.exit(1)
}

if (!config.cssUrl) {
  console.error('error: the "cssUrl" is required.')
  process.exit(1)
}

syncIconFont(config)
