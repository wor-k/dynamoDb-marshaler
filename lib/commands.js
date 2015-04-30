'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Converts boolean value to DynamoDb "BOOL"
 *
 * @param item
 * @returns {*}
 */
exports.marshalBoolean = marshalBoolean;

/**
 * Converts mixed array to DynamoDb "L"
 *
 * @param item
 * @param marshal
 * @returns {*}
 */
exports.marshalList = marshalList;

/**
 * Converts object literal to DynamoDb "M"
 *
 * @param item
 * @param marshal
 * @returns {*}
 */
exports.marshalMap = marshalMap;

/**
 * Converts null to DynamoDb "NULL"
 *
 * @param item
 * @returns {*}
 */
exports.marshalNull = marshalNull;

/**
 * Converts number to DynamoDb "N"
 *
 * @param item
 * @returns {*}
 */
exports.marshalNumber = marshalNumber;

/**
 * Converts Arrays and Sets to DynamoDb "NS"
 *
 * @param item
 * @returns {*}
 */
exports.marshalNumberSet = marshalNumberSet;

/**
 * Converts strings to DynamoDb "S"
 *
 * @param item
 * @returns {*}
 */
exports.marshalString = marshalString;

/**
 * Converts Arrays and Sets to DynamoDb "SS"
 *
 * @param item
 * @returns {*}
 */
exports.marshalStringSet = marshalStringSet;

/**
 * Converts DynamoDb "L" to mixed array
 *
 * @param item
 * @param unmarshal
 * @returns {*}
 */
exports.unmarshalList = unmarshalList;

/**
 * Converts DynamoDb "M" to object literal
 *
 * @param item
 * @param unmarshal
 * @returns {*}
 */
exports.unmarshalMap = unmarshalMap;

/**
 * Converts DynamoDb "NULL" to null
 *
 * @param item
 * @returns {*}
 */
exports.unmarshalNull = unmarshalNull;

/**
 * Converts DynamoDb "N" to Number
 *
 * @param item
 * @returns {*}
 */
exports.unmarshalNumber = unmarshalNumber;

/**
 * Converts DynamoDb "NS" to Set of Numbers
 *
 * @param item
 * @returns {*}
 */
exports.unmarshalNumberSet = unmarshalNumberSet;

/**
 * Converts DynamoDb "SS" to Set of Strings
 *
 * @param item
 * @returns {*}
 */
exports.unmarshalStringSet = unmarshalStringSet;

/**
 * Converts DynamoDb "S", "B", "BS", "BOOL" to values.
 *
 * @param item
 * @returns {*}
 */
exports.unmarshalPassThrough = unmarshalPassThrough;

var _import = require('lodash');

var _import2 = _interopRequireDefault(_import);

// Marshal command chain
var marshalCommandList = [marshalString, marshalNumber, marshalBoolean, marshalNull, marshalStringSet, marshalNumberSet, marshalList, marshalMap];

exports.marshalCommandList = marshalCommandList;
// Unmarshal command chain
var unmarshalCommandList = [unmarshalPassThrough, unmarshalNumber, unmarshalStringSet, unmarshalNumberSet, unmarshalNull, unmarshalMap, unmarshalList];exports.unmarshalCommandList = unmarshalCommandList;

function marshalBoolean(item) {
  if (!_import2['default'].isBoolean(item)) {
    return undefined;
  }
  return { BOOL: item };
}

function marshalList(item, marshal) {
  if (!_import2['default'].isArray(item)) {
    return undefined;
  }

  item = _import2['default'].map(item, marshal);
  return { L: item };
}

function marshalMap(item, marshal) {
  // Todo make this accept ES6 Map or Object Literal
  if (!_import2['default'].isPlainObject(item)) {
    return undefined;
  }

  item = _import2['default'].reduce(item, function (result, value, key) {
    result[key] = marshal(value);
    return result;
  }, {});

  return { M: item };
}

function marshalNull(item) {
  if (!_import2['default'].isNull(item) && !_import2['default'].isUndefined(item)) {
    return undefined;
  }
  return { NULL: true };
}

function marshalNumber(item) {
  if (!_import2['default'].isNumber(item)) {
    return undefined;
  }
  return { N: item.toString() };
}

/**
 * Helper function for arrays to DynamoDb "NS"
 *
 * @param arr
 * @returns {*}
 */
function marshalArrayToNumberSet(arr) {
  if (_import2['default'].isEmpty(arr) || !_import2['default'].every(arr, _import2['default'].isNumber) || _import2['default'].uniq(arr).length !== arr.length) {
    return undefined;
  }

  arr = _import2['default'].map(arr, function stringify(num) {
    return num.toString();
  });

  return { NS: arr };
}
function marshalNumberSet(item) {
  if (_import2['default'].isArray(item)) {
    return marshalArrayToNumberSet(item);
  }

  if (item instanceof Set) {
    return marshalArrayToNumberSet(Array.from(item));
  }

  return undefined;
}

function marshalString(item) {
  if (!_import2['default'].isString(item) || _import2['default'].isEmpty(item)) {
    return undefined;
  }
  return { S: item };
}

/**
 * Helper function for arrays to DynamoDb "SS"
 *
 * @param arr
 * @returns {*}
 */
function marshalArrayToStringSet(arr) {
  if (_import2['default'].isEmpty(arr) || !_import2['default'].every(arr, _import2['default'].isString) || _import2['default'].uniq(arr).length !== arr.length) {
    return undefined;
  }

  return { SS: arr };
}
function marshalStringSet(item) {
  if (_import2['default'].isArray(item)) {
    return marshalArrayToStringSet(item);
  }

  if (item instanceof Set) {
    return marshalArrayToStringSet(Array.from(item));
  }

  return undefined;
}

function unmarshalList(item, unmarshal) {
  if (!_import2['default'].has(item, 'L')) {
    return undefined;
  }

  return _import2['default'].map(item.L, unmarshal);
}

function unmarshalMap(item, unmarshal) {
  // Todo Make this convert to ES6 Map instead of object literal
  if (!_import2['default'].has(item, 'M')) {
    return undefined;
  }

  return _import2['default'].mapValues(item.M, unmarshal);
}

function unmarshalNull(item) {
  if (!_import2['default'].has(item, 'NULL')) {
    return undefined;
  }

  return null;
}

function unmarshalNumber(item) {
  if (!_import2['default'].has(item, 'N')) {
    return undefined;
  }

  return parseFloat(item.N);
}

function unmarshalNumberSet(item) {
  if (!_import2['default'].has(item, 'NS')) {
    return undefined;
  }

  return new Set(_import2['default'].map(item.NS, parseFloat));
}

function unmarshalStringSet(item) {
  if (!_import2['default'].has(item, 'SS')) {
    return undefined;
  }

  return new Set(item.SS);
}

function unmarshalPassThrough(item) {
  var typeList = ['S', 'B', 'BS', 'BOOL'];

  var key = _import2['default'].find(typeList, function (type) {
    return _import2['default'].has(item, type);
  });

  if (!key) {
    return undefined;
  }

  return item[key];
}