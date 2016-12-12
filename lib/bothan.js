/**
 * A node.js client library for Bothan \- https:\/\/bothan.io
 *
 * @package bothan-api
 * @author Open Data Institute <ops@theodi.org>
 */

var _ = require('underscore');
var Client = require('node-rest-client').Client;

function registerClientMethods(baseURL) {
  client.registerMethod('listMetrics', baseURL + '/metrics.json', 'GET');
}

var exports = module.exports = {};

exports.init = function(_options) {
  var requiredOptions = [ 'user', 'pass', 'endpoint' ],
    missingOptions  = _.difference(requiredOptions, _.keys(_options));

  if(missingOptions.length){
    throw new Error('The following options are required: ' + missingOptions.join(', '));
  }

  client = new Client({
    user: _options.key,
    password: _options.pass
  });

  registerClientMethods(_options.endpoint)

  return client;
}
