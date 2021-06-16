# find-files-recur

A simple search utility that can be fine-tuned and which will recursively search for files in a folder and provide detailled data about the results.

```js
const findFiles = require('find-files-recur')

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
  Extensions to look for  
  Default: []

- detailedResults - _Boolean_  
  Whether the function returns only the path of found files, or detailed data (such as name, extension, depth, etc.)  
  Default: false

- ignoredFolderNames - _Array_
  Which folders to ignore, when encountered in the recursive search.  
  Default: [
  'node_modules',
  'bower_components',
  '.git',
  'tmp',
  'temp',
  'public',
  'dist',
  ]

- filter - _Function_  
  Callback executed for every file selected, that tells the crawler whether to select it or not in the final result.  
  Receive the file's detailed data as its only parameter.

- maxDepth - _Number_
  Maximum depth for search, relative to the starting point  
  Default: undefined

- maxSearchedFiles - _Number_  
  The search will automatically stop if this number is reached  
  Default: 5000

## Other

🐥 Really small footprint. This library doesn't add any external dependencies to your project
