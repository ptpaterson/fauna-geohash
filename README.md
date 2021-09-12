# A geohash implementation for Fauna FQL

Some helper functions to create geohasing UDF's and Indexes with geohash bindings.

## background

A geohash is a series of bits that repeatedly bisects a search space of latitudes and longitudes. The first bit bisects the longitude, the next one latitude, the next longitude, etc.

https://en.wikipedia.org/wiki/Geohash

# Basic Usage

## Create a UDF to calculate geohashes

```javascript
const { Client } = require('faunadb')

const client = new Client({
  secret: MY_FAUNA_KEY,
  domain: "db.fauna.com", // | "db.us.fauna.com" | "db.eu.fauna.com"
})

// number of bits used for the encoding
const precision = 52 
// typical CreateFunction param object, excluding the `body` property
const params: CreateGeohashFunctionParams = { name: 'fn' } 

client.query(CreateGeohashFunction(precision, params))
```

## Create an Index that calculates geohashes as a binding

```javascript
const { Client } = require('faunadb')

const client = new Client({
  secret: MY_FAUNA_KEY,
  domain: "db.fauna.com", // | "db.us.fauna.com" | "db.eu.fauna.com"
})

// number of bits used for the encoding
const precision = 52 
// similar to CreateIndex params object.  Requires understanding of where to Select 
// latitude and longitude from Documents.
const params: CreateGeohashIndexParams = {
  name: 'index',
  collection: q.Collection('things'),
  latPath: ['data', 'lat'],
  lngPath: ['data', 'lng'],
}

client.query(CreateGeohashIndex(precision, params))
```

## Currying `precision` (kinda), just for fun

```javascript
const CreateGeoHashFunction52 = CreateGeohashFunction.withPrecision(52)
const CreateGeoHashIndex52 = CreateGeohashIndex.withPrecision(52)
```

# TODO: Tips for querying for nearby locations

> now that we have indexes with geohashes, we need to figure out how to query 
> for useful things