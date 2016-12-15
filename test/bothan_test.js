var Bothan = require('../lib/bothan')
var expect = require('chai').expect
var vcr = require('nock-vcr-recorder-mocha');

var tk = require('timekeeper');

vcr.describe('Bothan', function() {
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

  vcr.it('lists all metrics', function(done) {
    bothan.listMetrics(function(data, response) {
      expect(data).to.eql([
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
        ])
      done()
    })
  })

  vcr.it('gets a metric', function(done) {
    bothan.getMetric({'metric': 'simple-metric'}, function(data) {
      expect(data).to.eql({
        '_id': {
          '$oid': '584fd6680d737a00040e5df2'
        },
        'name': 'simple-metric',
        'time': '2016-12-13T11:07:20.401+00:00',
        'value': 99
      })
      done()
    });
  })

  vcr.it('gets a metric for a date', function(done) {
    bothan.getMetric({'metric': 'simple-metric', 'time': '2016-12-12T07:00:24.465+00:00'}, function(data) {
      expect(data).to.eql({
        '_id': {
          '$oid': '584fd6680d737a00040e5e02'
        },
        'name': 'simple-metric',
        'time': '2016-12-11T11:07:20.458+00:00',
        'value': 13
      })
      done()
    })
  })

  vcr.it('gets a metric for a date range', function(done) {
    bothan.getMetric({'metric': 'simple-metric', 'from': '2016-11-12T14:29:37+00:00', 'to': '2016-12-12T14:29:37+00:00'}, function(data) {
      expect(data).to.eql({
        'count': 4,
        'values': [
          {
            'time': '2016-12-09T11:07:20.526+00:00',
            'value': 21
          },
          {
            'time': '2016-12-10T11:07:20.500+00:00',
            'value': 2
          },
          {
            'time': '2016-12-11T11:07:20.458+00:00',
            'value': 13
          },
          {
            'time': '2016-12-12T11:07:20.433+00:00',
            'value': 66
          }
        ]
      })
      done()
    })
  })

  vcr.it('creates a simple metric', function(done) {
    bothan.createMetric({name: 'my-new-metric', value: 123}, function() {
      bothan.getMetric({'metric': 'my-new-metric'}, function(data) {
        expect(data.value).to.eql(123)
        expect(data.time).to.eql('2016-01-01T00:00:00.000+00:00')
        done()
      })
    })
  })

  vcr.it('creates a simple metric with a specific time', function(done) {
    bothan.createMetric({name: 'my-new-metric', value: 123, time: '2016-12-23T00:00:00.000+00:00'}, function() {
      bothan.getMetric({'metric': 'my-new-metric'}, function(data) {
        expect(data.value).to.eql(123)
        expect(data.time).to.eql('2016-12-23T00:00:00.000+00:00')
        done()
      })
    })
  })

  vcr.it('creates a metric with a target', function(done) {
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

  vcr.it('creates a metric with multiple values', function(done) {
    values =  {
      'value1': 123,
      'value2': 23213,
      'value4': 1235
    }
    bothan.createMultipleMetric({name: 'my-new-multiple-metric', values: values}, function() {
      bothan.getMetric({'metric': 'my-new-multiple-metric'}, function(data) {
        expect(data.value).to.eql({
          total: values
        })
        done()
      })
    })
  })

  vcr.it('creates a metric with geodata', function(done) {
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

  vcr.it('creates a new metric with increment', function(done) {
    bothan.incrementMetrics({name: 'my-new-metric'}, function() {
      bothan.getMetric({'metric': 'my-new-metric'}, function(data) {
        expect(data.value).to.eql(1)
        done()
      })
    });
  })

  vcr.it('increments an existing metric', function(done) {
    bothan.createMetric({name: 'my-metric-for-increment', value: 123}, function() {
      bothan.incrementMetrics({name: 'my-metric-for-increment'}, function() {
        bothan.getMetric({'metric': 'my-metric-for-increment'}, function(data) {
          expect(data.value).to.eql(124)
          done()
        })
      });
    })
  })

  vcr.it('increments by a given amount', function(done) {
    bothan.createMetric({name: 'my-new-metric-for-increment', value: 123}, function() {
      bothan.incrementMetrics({name: 'my-metric-for-increment', amount: 123}, function() {
        bothan.getMetric({'metric': 'my-metric-for-increment'}, function(data) {
          expect(data.value).to.eql(246)
          done()
        })
      });
    })
  })

});
