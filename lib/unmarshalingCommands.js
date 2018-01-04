'use strict';

var _ = require('lodash/fp');
var unexpectedItemHandler = require('./unexpectedItemHandler');
var transform = require('./transform');

/**
 * Converts DynamoDb "L" to mixed array
 *
 * @param item
 * @param unmarshal
 * @returns {*}
 */
function unmarshalList(item, unmarshal) {
  return transform(_.has('l'), _.compose(_.map(unmarshal), _.property('l')), item);
}

/**
 * Converts DynamoDb "M" to object literal
 *
 * @param item
 * @param unmarshal
 * @returns {*}
 */
function unmarshalMap(item, unmarshal) {
  return transform(_.has('m'), _.compose(_.mapValues(unmarshal), _.property('m')), item);
}

/**
 * Converts DynamoDb "NULL" to null
 *
 * @param item
 * @returns {*}
 */
var unmarshalNull = transform(_.has('null'), _.constant(null));

/**
 * Converts DynamoDb "N" to Number
 *
 * @param item
 * @returns {*}
 */
var unmarshalNumber = transform(_.has('n'), _.compose(parseFloat, _.property('n')));

/**
 * Converts DynamoDb "NS" to Set of Numbers
 *
 * @param item
 * @returns {*}
 */
var unmarshalNumberSet = transform(_.has('ns'), _.compose(_.map(parseFloat), _.property('ns')));

/**
 * Converts DynamoDb "SS" to Set of Strings
 *
 * @param item
 * @returns {*}
 */
var unmarshalStringSet = transform(_.has('ss'), _.property('ss'));

/**
 * Converts DynamoDb "S", "B", "BS", "BOOL" to values.
 *
 * @param item
 * @returns {*}
 */

function unmarshalPassThrough(item) {
  var key = _.find(function(type) {
    return _.has(type, item);
  }, ['s', 'b', 'bs', 'bool']);

  return !key ? void 0 : item[key];
}

module.exports = [
  unmarshalPassThrough,
  unmarshalNumber,
  unmarshalStringSet,
  unmarshalNumberSet,
  unmarshalNull,
  unmarshalMap,
  unmarshalList,
  unexpectedItemHandler
];
