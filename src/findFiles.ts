const { existsSync, statSync, readdirSync } = require('fs')
const { basename, join, extname } = require('path')

export const IGNORED_FOLDERS = [
  'node_modules',
  'bower_components',
  '.git',
  'tmp',
  'temp',
  'public',
  'dist',
]

export type Options = {
  extensions?: string[]
  ignoredFolderNames?: string[]
  filter?: Function
  __count__?: number
  __depth__?: number
  detailedResults?: boolean
  maxDepth?: number
  maxSearchedFiles?: number
}

const MAX_SEARCHED_FILES = 5000

function walkRecur(fullPath, options: Options = {}, results = [], depth = 0) {
  // if (options.debug) {
  //   console.log({ depth, maxDepth: options.maxDepth })
  // }
  if (options.maxDepth && depth > options.maxDepth) {
    return results
  }
  try {
    const stat = statSync(fullPath)
    const isDirectory = stat.isDirectory()
    let name = basename(fullPath)
    // DIRECTORY
    if (isDirectory) {
      if (
        options.__count__ >= (options.maxSearchedFiles || MAX_SEARCHED_FILES)
      ) {
        console.log('⚠️ Too many files')
        return results
      }

      if ((options.ignoredFolderNames || IGNORED_FOLDERS).includes(name)) {
        return results
      }
      // Continue recursion
      const children = readdirSync(fullPath)

      children.map((childName) =>
        walkRecur(join(fullPath, childName), options, results, depth + 1),
      )
    } else {
      // FILE
      options.__count__++
      const extension = extname(fullPath).replace(/^\./, '').toLowerCase()
      if (options.extensions) {
        if (!options.extensions.includes(extension)) {
          return results
        }
      }

      const index = name.indexOf('.')
      const nameWithoutExtension = name.substr(0, index)
      const fullExtension = name.substr(index + 1)
      const fileDetails = {
        path: fullPath,
        name,
        nameWithoutExtension,
        extension,
        fullExtension,
        depth,
      }

      if (options.filter && Boolean(options.filter(fileDetails)) === false) {
        return results
      }
      if (options.detailedResults) {
        results.push(fileDetails)
      } else {
        results.push(fullPath)
      }
    }
    return results
  } catch (ex) {
    console.error(`walkRecur() error when processing: ${fullPath}`)
    console.error(`${ex.message}`)
    return
  }
}

export function findFiles(path, options: Options = {}) {
  const results = []
  options.__count__ = 0
  options.__depth__ = 0
  if (!existsSync(path)) {
    console.log(`${path} does not exist`)
    return []
  }
  walkRecur(path, options, results)
  console.log('🔍 Count of searched files:', options.__count__)
  return results
}
