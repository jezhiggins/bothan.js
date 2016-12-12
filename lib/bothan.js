/**
 * A node.js client library for Bothan \- https:\/\/bothan.io
 *
 * @package bothan-api
 * @author Open Data Institute <ops@theodi.org>
 */

var _ = require('underscore');
var Client = require('node-rest-client').Client;

var Bothan = function(_options) {
  var requiredOptions = [ 'user', 'pass', 'endpoint' ],
    missingOptions  = _.difference(requiredOptions, _.keys(_options));

  if(missingOptions.length){
    throw new Error('The following options are required: ' + missingOptions.join(', '));
  }

  this.baseURL = _options.endpoint;

  this.client = new Client({
    user: _options.key,
    password: _options.pass
  });
}

Bothan.prototype = {
  listMetrics: function (callback) {
    this.client.get(this.baseURL + '/metrics.json', function(data, response) {
      callback(data);
      return;
    })
  },
  getMetric: function(options, callback) {
    if (options.dateTime) {
      url = this.baseURL + '/metrics/'+ options.metric +'/'+ options.dateTime +'.json'
    } else if (options.from && options.to) {
      url = this.baseURL + '/metrics/'+ options.metric +'/'+ options.from +'/'+ options.to +'.json'
    } else {
      url = this.baseURL + '/metrics/'+ options.metric +'.json'
    }

    this.client.get(url, function(data, response) {
      callback(data);
      return;
    })
  }
}

module.exports = Bothan;
