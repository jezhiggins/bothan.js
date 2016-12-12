require('sepia');

var Bothan = require('../lib/bothan')
var expect = require('chai').expect

describe('Bothan', function() {
  var bothan;

  before(function() {
    bothan = new Bothan({user: 'username', pass: 'password', endpoint: 'https://demo.bothan.io'})
  });

  it('throws an error if options are missing', function() {
    expect(function() {
      new Bothan({user: 'username', pass: 'password'})
    }).to.throw(Error, 'The following options are required: endpoint')
  });

  it('lists all metrics', function(done) {
    bothan.listMetrics(function(data, response) {
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

  it('gets a metric', function(done) {
    bothan.getMetric({'metric': 'simple-metric'}, function(data) {
      expect(data).to.eql({
        '_id': {
          '$oid': '584e4b08492ad60004679936'
        },
        'name': 'simple-metric',
        'time': '2016-12-12T07:00:24.465+00:00',
        'value': 37
      })
      done()
    });
  })

  it('gets a metric for a date', function(done) {
    bothan.getMetric({'metric': 'simple-metric', 'dateTime': '2016-12-12T07:00:24.465+00:00'}, function(data) {
      expect(data).to.eql({
        '_id': {
          '$oid': '584e4b08492ad6000467993e'
        },
        'name': 'simple-metric',
        'time': '2016-12-11T07:00:24.493+00:00',
        'value': 67
      })
      done()
    })
  })

  it('gets a metric for a date range', function(done) {
    bothan.getMetric({'metric': 'simple-metric', 'from': '2016-11-12T14:29:37+00:00', 'to': '2016-12-12T14:29:37+00:00'}, function(data) {
      expect(data).to.eql({
        "count": 5,
        "values": [
          {
            "time": "2016-12-08T07:00:24.551+00:00",
            "value": 33
          },
          {
            "time": "2016-12-09T07:00:24.536+00:00",
            "value": 2
          },
          {
            "time": "2016-12-10T07:00:24.516+00:00",
            "value": 71
          },
          {
            "time": "2016-12-11T07:00:24.493+00:00",
            "value": 67
          },
          {
            "time": "2016-12-12T07:00:24.465+00:00",
            "value": 37
          }
        ]
      })
      done()
    })
  })

  it('creates a simple metric', function(done) {
    bothan.createMetric({name: 'my-new-metric', value: 123}, function() {
      bothan.getMetric({'metric': 'my-new-metric'}, function(data) {
        expect(data.value).to.eql(123)
        done()
      })
    })
  })

  it('creates a metric with a target', function(done) {
    bothan.createTargetMetric({name: 'my-new-target-metric', actual: 123, annual_target: 345, ytd_target: 130}, function() {
      bothan.getMetric({'metric': 'my-new-target-metric'}, function(data) {
        expect(data.value).to.eql({
          actual: 123,
          annual_target: 345,
          ytd_target: 130
        })
        done()
      })
    })
  })

});
