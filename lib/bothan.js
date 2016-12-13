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
    user: _options.user,
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
  },
  createMetric: function(options, callback) {
    url = this.baseURL + '/metrics/' + options.name
    data = {
      time: (options.time === undefined ? (new Date).toISOString() : options.time),
      value: options.value
    }

    this.client.post(url, { data: data }, function(data, response) {
      callback(data);
    })
  },
  createTargetMetric: function(options, callback) {
    opts = {
      name: options.name,
      value: {
        actual: options.actual,
        annual_target: options.annual_target,
        ytd_target: options.ytd_target
      }
    }

    this.createMetric(opts, function() {
      callback(data);
    })
  },
  createMultipleMetric: function(options, callback) {
    opts = {
      name: options.name,
      value: {
        total: options.values
      }
    }

    this.createMetric(opts, function() {
      callback(data);
    })
  },
  createGeoMetric: function(options, callback) {
    opts = {
      name: options.name,
      value: {
        type: 'FeatureCollection',
        features: options.values
      }
    }

    this.createMetric(opts, function() {
      callback(data);
    })
  }
}

module.exports = Bothan;
