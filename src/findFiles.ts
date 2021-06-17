const { existsSync, statSync, readdirSync } = require('fs')
const { basename, join, extname } = require('path')
const { log, error } = require('./logger')

export const IGNORED_FOLDERS = [
  'node_modules',
  'bower_components',
  '.git',
  'public',
  'dist',
]

export const TOO_MANY_FILES_ERROR = '⚠️ Too many files:'

export type Options = {
  detailedResults?: boolean
  extensions?: string[]
  ignoredFolderNames?: string[]
  filter?: Function
  maxDepth?: number
  maxSearchedFiles?: number
  // Below: for internal use only
  __count__?: number
  __depth__?: number
}

export type FileDetails = {
  path: string
  name: string
  nameWithoutExtension: string
  extension: string
  fullExtension: string
  depth: number
}

export type FindFilesResult = string[] | FileDetails[]

const MAX_SEARCHED_FILES = 5000

function walkRecur(
  fullPath,
  options: Options = {},
  results: FindFilesResult = [],
  depth = 0,
): FindFilesResult {
  // if (options.debug) {
  //   log({ depth, maxDepth: options.maxDepth })
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
        error(TOO_MANY_FILES_ERROR)
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
      const fileDetails: FileDetails = {
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
        ;(results as FileDetails[]).push(fileDetails)
      } else {
        results.push(fullPath)
      }
    }
    return results
  } catch (ex) {
    error(`walkRecur() error when processing: ${fullPath}`)
    error(`${ex.message}`)
    return
  }
}

export function findFiles(
  path,
  options: Options = {},
): FileDetails[] | string[] {
  let results
  if (options.detailedResults) {
    results = [] as FileDetails[]
  } else {
    results = [] as string[]
  }

  options.__count__ = 0
  options.__depth__ = 0
  if (!existsSync(path)) {
    throw new Error(`${path} does not exist`)
  }
  walkRecur(path, options, results)
  log('🔍 Count of searched files:', options.__count__)
  return results
}
