[![Build Status](http://img.shields.io/travis/theodi/bothan.js.svg?style=flat-square)](https://travis-ci.org/theodi/bothan.js)
[![Code Climate](http://img.shields.io/codeclimate/github/theodi/bothan.js.svg?style=flat-square)](https://codeclimate.com/github/theodi/bothan.js)
[![Coverage Status](https://img.shields.io/coveralls/theodi/bothan.js.svg?style=flat-square)](https://coveralls.io/github/theodi/bothan.js?branch=master)[![NPM Version](https://img.shields.io/npm/v/bothan-api.svg?style=flat-square)](https://www.npmjs.com/package/bothan-api)
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://theodi.mit-license.org)

## bothan.js

A node.js client for [Bothan](https://bothan.io/), a simple platform for storing and publishing metrics.

### Installation

```bash
npm install bothan-api
```

### Testing
```bash
npm test
```

## Usage

First require the Bothan client:

```javascript
bothan = require('bothan')
```

Then initialize a connection with your username, password and the url of your Bothan endpoint:

```javascript
bothan = new Bothan({user: 'username', pass: 'password', endpoint: 'https://demo.bothan.io'})
```

You will then be able to interact with your [Bothan API](https://bothan.io/api.html) like so:

### Get all metrics

Returns a list of available metrics as an array of objects

```javascript
bothan.listMetrics(function(data) {
  console.log(data)
})
```

### Find a metric

#### Latest value

Returns the latest value for a specified metric as an object

```javascript
bothan.getMetric({'metric': 'simple-metric'}, function(data) {
  console.log(data)
})
```

#### For a specific DateTime

Returns the most recent value of a metric at the specified datetime.

```javascript
bothan.getMetric({'metric': 'simple-metric', 'time': '2016-12-12T07:00:24.465+00:00'}, function(data) {
  console.log(data)
})
```

#### For a specific DateTime range

Returns all values of the metric between the specified times.

```javascript
bothan.getMetric({'metric': 'simple-metric', 'from': '2016-12-01T07:00:22.851+00:00', 'to': '2016-12-05T07:00:22.459+00:00'}, function(data) {
  console.log(data)
})
```

### Create a metric


The Bothan API supports four types of metric, all supported by the gem.

#### Create a [simple metric](https://bothan.io/api#simple-value)

```javascript
// Create a metric called 'my-new-metric' with a value of '12' at the current datetime
bothan.createMetric({name: 'my-new-metric', value: 123}, function(data) {
  console.log(data)
})
// Create a metric with a specific datetime
bothan.createMetric({name: 'my-new-metric', value: 123, time: '2016-12-23T00:00:00.000+00:00'}, function(data) {
  console.log(data)
})
```

#### Create a [metric with a target](https://bothan.io/api#value-with-a-target)

```javascript
// Create a metric called 'my-new-metric' with a value of '1091000', an annual target of '2862000' and a ytd target of '1368000' at the current datetime
bothan.createTargetMetric({name: 'my-new-target-metric', actual: 1091000, annual_target: 2862000, ytd_target: 1368000}, function() {
  console.log(data)
})
// Create a metric with a target at a specific datetime
bothan.createTargetMetric({name: 'my-new-target-metric', actual: 1091000, annual_target: 2862000, ytd_target: 1368000, time: '2016-12-23T00:00:00.000+00:00'}, function() {
  console.log(data)
})
// Create a metric without a ytd target
bothan.createTargetMetric({name: 'my-new-target-metric', actual: 1091000, annual_target: 2862000}, function() {
  console.log(data)
})
// Create a metric without a ytd target at a specific datetime
bothan.createTargetMetric({name: 'my-new-target-metric', actual: 1091000, annual_target: 2862000, time: '2016-12-23T00:00:00.000+00:00'}, function() {
  console.log(data)
})
```

#### Create a [metric with multiple values](https://bothan.io/api#multiple-values)

```javascript
// Create a metric called 'my-new-metric' with multiple values with the current datetime
bothan.createMultipleMetric({name: 'my-new-metric', values: {
  'value1': 123,
  'value2': 23213,
  'value4': 1235
}}, function(data) {
  console.log(data)
})

// Create a metric called 'my-new-metric' with multiple values with a specific datetime
bothan.createMultipleMetric({name: 'my-new-metric', values: {
  'value1': 123,
  'value2': 23213,
  'value4': 1235
}, time: '2016-12-23T00:00:00.000+00:00'}, function(data) {
  console.log(data)
})
```

#### Create a [metric with geodata](https://bothan.io/api#geographical-data)

```javascript
// Create a geodata metric called 'my-new-metric' with the current datetime
bothan.createGeoMetric({name: 'my-new-metric', values: {
  'type' => 'Feature',
  'geometry' => {
    'type' => 'Point',
    'coordinates' => [-2.6156582783015017, 54.3497405310758]
  }
},
{
  'type' => 'Feature',
  'geometry' => {
    'type' => 'Point',
     'coordinates' => [-6.731370299641439, 55.856756177781186]
  }
}
}, function(data) {
  console.log(data)
})

// Create a geodata metric called 'my-new-metric' with a specific datetime
bothan.createGeoMetric({name: 'my-new-geometric', values: {
  'type' => 'Feature',
  'geometry' => {
    'type' => 'Point',
    'coordinates' => [-2.6156582783015017, 54.3497405310758]
  }
},
{
  'type' => 'Feature',
  'geometry' => {
    'type' => 'Point',
     'coordinates' => [-6.731370299641439, 55.856756177781186]
  }
}, time: '2016-12-23T00:00:00.000+00:00'}, function(data) {
  console.log(data)
})
```

## Development

After checking out the repo, run `npm install` to install dependencies. Then, run `npm test` to run the tests.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/theodi/bothan.js. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
