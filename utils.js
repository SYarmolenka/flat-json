const {
  cond, curry, is, pipe, T, reduce, not, split, head, last, equals, allPass, prop,
} = require('ramda');
const { readdirSync, readFileSync, writeFileSync } = require('fs');

const {
  LEVEL_DIVIDE,
  OBJECT_DIVIDE,
  ARRAY,
  OBJECT,
  STRING,
  NUMBER,
  BOOLEAN,
  NULL,
} = require('./consts');

const getHandler = (type, name, value) => ({ [`${name}${LEVEL_DIVIDE}${type}`]: value });

const handleString = curry(getHandler)(STRING);
const handleNumber = curry(getHandler)(NUMBER);
const handleBoolean = curry(getHandler)(BOOLEAN);
const handleNull = curry(getHandler)(NULL);

const handleSimpleType = (name, value) => cond([
  [is(String), handleString(name)],
  [is(Number), handleNumber(name)],
  [is(Boolean), handleBoolean(name)],
  [T, handleNull(name)],
])(value);


const getPath = pipe(
  split(LEVEL_DIVIDE),
  reduce((acc, item) => pipe(
    split(OBJECT_DIVIDE),
    cond([
      [pipe(allPass([Boolean, prop(1)]), not), () => acc],
      [pipe(head, equals(ARRAY)), pipe(last, Number, (num) => [...acc, num])],
      [pipe(head, equals(OBJECT)), pipe(last, (str) => [...acc, str])],
      [T, () => acc],
    ]),
  )(item), []),
);

const checkValidJson = (json) => {
  try {
    JSON.stringify(json);
  } catch (e) {
    return false;
  }

  return is(Object, json);
};

const handleFiles = (handler) => {
  const regexp = /\.json$/i;
  const files = readdirSync('./raw');

  readdirSync('./raw')
    .filter((name) => regexp.test(name))
    .forEach((filename) => {
      const file = readFileSync(`./raw/${filename}`);
      const result = handler(JSON.parse(file));

      writeFileSync(`./result/${filename}`, JSON.stringify(result, null, 2));
    });
  
  console.log('Command done! Check the result folder.')
}

module.exports = {
  handleSimpleType, getPath, checkValidJson, handleFiles,
}