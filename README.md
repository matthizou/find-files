# find-files-recur

A simple search utility that can be fine-tuned and which will recursively search for files in a folder and provide detailled data about the results.

```js
const findFiles = require('find-files-recur')

// const { findFiles } from 'find-files-recur'  // Typescript

const result = findFiles('./the/root/path/src', {
  extensions: ['js'],
  detailedResults: true,
})
```

Result with `detailedResults` omitted or set to `false`

```
['src/folder1/folder11/test.js']
```

Result with `detailedResults` set to `true`

```
[
  {
    depth: 4,
    extension: 'js',
    fullExtension: 'test.js',
    name: 'test.js',
    nameWithoutExtension: 'test',
    path: 'src/folder1/folder11/test.js',
  },
]
```

## Options

- extensions - _Array_  
  File extensions to look for - ie: `['js','md']`  
  If not defined, all files are selected
  Default: _undefined_

- detailedResults - _Boolean_  
  Whether the function returns only the path of found files, or detailed data (see type below)  
  Default: `false`
  ```ts
  export type FileDetails = {
    path: string
    name: string
    nameWithoutExtension: string
    extension: string
    fullExtension: string
    depth: number
  }
  ```
- filter - _Function_  
  Callback executed for every file selected, that tells the crawler whether to select it or not in the final result.  
  As this function is executed during search, it offers a benefit, memory-wise, to the alternative of getting all results, and then filtering them.  
  Receive the file's detailed data as its only parameter.

  ```js
  // i.e: Select of index files
  const results = findFiles('some/path', {
    extensions: ['js', 'ts'],
    filter: ({ nameWithoutExtension }) => nameWithoutExtension === 'index',
  })
  ```

- maxDepth - _Number_
  Maximum depth for search, relative to the starting point  
  Default: _undefined_

- maxSearchedFiles - _Number_  
  The search will automatically stop if this number is reached  
  Default: `5000`

- ignoredFolderNames - _Array_
  Which folders to ignore, when encountered in the recursive search.  
  Default: `[ 'node_modules', 'bower_components', '.git', 'public', 'dist', ]`

## Notes

- 🐥 Really small footprint. This library doesn't add any external dependency to your project
- The search is synchronous
