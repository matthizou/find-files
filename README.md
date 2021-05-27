# find-files-recur

A simple search utility that can be fine-tuned and which will recursively search for files in a folder and provide detailled data about the results.

```js
const findFiles = require('find-files-recur')

findFiles('./the/root/path/src', {
  extensions: ['js'],
  detailedResults: true,
})

// Results:
// [
//    {
//       "depth": 4,
//        "extension": "js",
//        "fullExtension": "test.js",
//        "name": "test.js",
//        "nameWithoutExtension": "test",
//        "path": "src/folder1/folder11/test.js",
//    },
// ]
```
