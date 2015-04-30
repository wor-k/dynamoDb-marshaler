'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _marshalItem = require('./marshalItem');

var _marshalItem2 = _interopRequireDefault(_marshalItem);

var _marshalJson = require('./marshalJson');

var _marshalJson2 = _interopRequireDefault(_marshalJson);

var _unmarshalItem = require('./unmarshalItem');

var _unmarshalItem2 = _interopRequireDefault(_unmarshalItem);

var _unmarshalJson = require('./unmarshalJson');

var _unmarshalJson2 = _interopRequireDefault(_unmarshalJson);

require('babel/polyfill');

var marshaler = {
  marshalItem: _marshalItem2['default'],
  marshalJson: _marshalJson2['default'],
  toDDB: _marshalItem2['default'],
  toJS: _unmarshalItem2['default'],
  unmarshalItem: _unmarshalItem2['default'],
  unmarshalJson: _unmarshalJson2['default']
};

exports['default'] = marshaler;
module.exports = exports['default'];