import { Collection } from 'faunadb'
import {
  CreateGeohashFunction,
  CreateGeohashIndex,
  CreateGeohashFunctionParams,
  CreateGeohashIndexParams,
} from '../src'

describe('CreateGeohashFunction', () => {
  const precision = 52
  const params: CreateGeohashFunctionParams = { name: 'fn' }

  const fn = CreateGeohashFunction(precision, params)

  it('can be partially applied', () => {
    const a = JSON.stringify(fn)
    const b = JSON.stringify(
      CreateGeohashFunction.withPrecision(precision)(params)
    )
    expect(a).toEqual(b)
  })
})

describe('CreateGeohashIndex', () => {
  const precision = 52
  const params: CreateGeohashIndexParams = {
    name: 'index',
    collection: Collection('things'),
    latPath: ['data', 'lat'],
    lngPath: ['data', 'lng'],
  }

  const index = CreateGeohashIndex(precision, params)

  it('can be partially applied', () => {
    const a = JSON.stringify(index)
    const b = JSON.stringify(
      CreateGeohashIndex.withPrecision(precision)(params)
    )

    expect(a).toEqual(b)
  })
})
