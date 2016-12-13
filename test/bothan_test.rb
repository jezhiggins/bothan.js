require('sepia');

var Bothan = require('../lib/bothan')
var expect = require('chai').expect
var tk = require('timekeeper');

describe('Bothan', function() {
  var bothan;

  before(function() {
    bothan = new Bothan({user: 'username', pass: 'password', endpoint: 'https://demo.bothan.io'})
    var time = new Date('2016-01-01T00:00:00');
    tk.freeze(time);
  });

  after(function() {
    tk.reset();
  })

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
          '$oid': '584fccacbe0e7a0004db7322'
        },
        'name': 'simple-metric',
        'time': '2016-12-13T10:25:48.733+00:00',
        'value': 17
      })
      done()
    });
  })

  it('gets a metric for a date', function(done) {
    bothan.getMetric({'metric': 'simple-metric', 'dateTime': '2016-12-12T07:00:24.465+00:00'}, function(data) {
      expect(data).to.eql({
        '_id': {
          '$oid': '584fccacbe0e7a0004db7332'
        },
        'name': 'simple-metric',
        'time': '2016-12-11T10:25:48.780+00:00',
        'value': 99
      })
      done()
    })
  })

  it('gets a metric for a date range', function(done) {
    bothan.getMetric({'metric': 'simple-metric', 'from': '2016-11-12T14:29:37+00:00', 'to': '2016-12-12T14:29:37+00:00'}, function(data) {
      expect(data).to.eql({
        'count': 4,
        'values': [
          {
            'time': '2016-12-09T10:25:48.820+00:00',
            'value': 83
          },
          {
            'time': '2016-12-10T10:25:48.800+00:00',
            'value': 22
          },
          {
            'time': '2016-12-11T10:25:48.780+00:00',
            'value': 99
          },
          {
            'time': '2016-12-12T10:25:48.760+00:00',
            'value': 36
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

  it('creates a metric with geodata', function(done) {
    values =  [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-2.6156582783015017, 54.3497405310758]
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
           'coordinates': [-6.731370299641439, 55.856756177781186]
        }
      }
    ]
    bothan.createGeoMetric({name: 'my-new-geometric', values: values}, function() {
      bothan.getMetric({'metric': 'my-new-geometric'}, function(data) {
        expect(data.value).to.eql({
          type: 'FeatureCollection',
          features: values
        })
        done()
      })
    })
  })

});
