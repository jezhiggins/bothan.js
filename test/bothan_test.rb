require('sepia');

var Bothan = require('../lib/bothan')
var expect = require('chai').expect

describe('Bothan', function() {
  var bothan;

  before(function() {
    bothan = Bothan.init({user: 'username', pass: 'password', endpoint: 'https://demo.bothan.io'})
  });

  it('throws an error if options are missing', function() {
    expect(function() {
      Bothan.init({user: 'username', pass: 'password'})
    }).to.throw(Error, 'The following options are required: endpoint')
  });

  it('lists all metrics', function(done) {
    bothan.methods.listMetrics(function(data, response) {
      expect(data).to.eql({
        metrics: [
          {
            name: 'metric-with-geodata',
            url: 'https://demo.bothan.io/metrics/metric-with-geodata.json'
          },
          {
            name: 'metric-with-multiple-values',
            url: 'https://demo.bothan.io/metrics/metric-with-multiple-values.json'
          },
          {
            name: 'metric-with-target',
            url: 'https://demo.bothan.io/metrics/metric-with-target.json'
          },
          {
            name: 'metric-with-ytd-target',
            url: 'https://demo.bothan.io/metrics/metric-with-ytd-target.json'
          },
          {
            name: 'simple-metric',
            url: 'https://demo.bothan.io/metrics/simple-metric.json'
          }
        ]
      })
      done()
    })
  })

});
