const {
  cond, curry, is, pipe, merge, T, keys, reduce, isEmpty,
} = require('ramda');

const {
  LEVEL_DIVIDE, OBJECT_DIVIDE, ARRAY, OBJECT, EMPTY_ARRAY, EMPTY_OBJECT,
} = require('./consts');
const { handleSimpleType, checkValidJson, handleFiles } = require('./utils');

const handleObject = (name, obj) => cond([
  [isEmpty, cond([
    [is(Array), () => ({ [[name, LEVEL_DIVIDE, EMPTY_ARRAY].join('')]: [] })],
    [is(Object), () => ({ [[name, LEVEL_DIVIDE, EMPTY_OBJECT].join('')]: {} })],
  ])],
  [
    is(Array),
    (arr) => arr.reduce((acc, item, index) => {
      const nextName = [name, LEVEL_DIVIDE, ARRAY, OBJECT_DIVIDE, index].join('');

      return cond([
        [is(Object), pipe(curry(handleObject)(nextName), merge(acc))],
        [T, pipe(curry(handleSimpleType)(nextName), merge(acc))],
      ])(item);
    }, {}),
  ],
  [
    is(Object),
    (data) => pipe(
      keys,
      reduce((acc, key) => {
        const nextName = [name, LEVEL_DIVIDE, OBJECT, OBJECT_DIVIDE, key].join('');

        return cond([
          [is(Object), pipe(curry(handleObject)(nextName), merge(acc))],
          [T, pipe(curry(handleSimpleType)(nextName), merge(acc))],
        ])(data[key]);
      }, {}),
    )(data),
  ],
])(obj);

const transformToFlat = (json) => (checkValidJson(json) ? handleObject('', json) : json);

handleFiles(transformToFlat);
