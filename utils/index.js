var _ = require("lodash");
var utils = {};
utils.GOOGLE_BIN = "./GoogleNews-vectors.bin"

utils.sortObject = function (model) {
  return _.chain(model)
  .map((val, key) => {
    return { name: key, count: val }
  })
  .sortBy('count')
  .reverse()
  .keyBy('name')
  .mapValues('count')
  .value();
}

module.exports = utils;
