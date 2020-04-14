const {
  cond, is, pipe, keys, reduce, ifElse, split, head, equals, takeLast, assocPath,
} = require('ramda');

const {
  LEVEL_DIVIDE, STRING, NUMBER, BOOLEAN, NULL, EMPTY_ARRAY, EMPTY_OBJECT,
} = require('./consts');
const { getPath, checkValidJson, handleFiles } = require('./utils');

const extract = (json) => {
  const names = keys(json);
  const jsonWrap = pipe(
    head,
    getPath,
    head,
    ifElse(
      is(Number),
      () => [],
      () => ({}),
    ),
  )(names);

  return reduce((acc, name) => {
    const data = pipe(
      split(LEVEL_DIVIDE),
      takeLast(1),
      head,
      cond([
        [equals(STRING), () => String(json[name])],
        [equals(NUMBER), () => Number(json[name])],
        [equals(BOOLEAN), () => Boolean(json[name])],
        [equals(NULL), () => null],
        [equals(EMPTY_ARRAY), () => []],
        [equals(EMPTY_OBJECT), () => ({})],
      ]),
    )(name);

    return assocPath(getPath(name), data, acc);
  }, jsonWrap)(names);
};

const extractFromFlat = (json) => (checkValidJson(json) ? extract(json) : json);

handleFiles(extractFromFlat);
