## The package takes json files of any nesting level and creates new json files with one level nesting. The converting works in two direction.

## Easy start:

You should have [Node.js](https://nodejs.org/) for starting the package (18.15.0).

### `npm install` or `yarn`

files of package:

```
flat-json/
  raw/
  result/
  extract.js
  transform.js
  consts.js
  utils.js
  package.json
```

There are two folders for working with json files: raw and result. In raw folder you should put your json files for handling. In result folder you will find handled json files after completion of handling command. Json files should be valid and have structure of array or object, otherwise you will get the same files or error.

## Main commands:

### `npm run transform` or `yarn transform`
Transforms json files from high nesting level structure to one nesting level structure.

### `npm run extract` or `yarn extract`
Returns json files to native structure.
