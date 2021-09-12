import { query as q, values } from 'faunadb'
import {
  CreateGeohashFunction,
  CreateGeohashIndex,
  CreateGeohashFunctionParams,
  CreateGeohashIndexParams,
} from '../src'

import { setup, teardown, getClient } from './util'

// not perfectly accurate, since you can map a Page and the cursor type does not change
type Page<T> = {
  after?: T
  before?: T
  data: T[]
}

beforeAll(async () => {
  await setup()
  await getClient().query(q.CreateCollection({ name: 'things' }))
})

// comment out the teardown if you want to keep the test db around.
afterAll(teardown)

describe('CreateGeohashFunction', () => {
  const precision = 52
  const params: CreateGeohashFunctionParams = { name: 'fn' }

  const createFunction = CreateGeohashFunction(precision, params)

  it('works', async () => {
    await getClient().query(createFunction)
    const res = await getClient().query(q.Call('fn', 1, 1))

    expect(res).toEqual(3377810978642407)
  })

  it('can be partially applied', () => {
    const a = JSON.stringify(createFunction)
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
    collection: q.Collection('things'),
    latPath: ['data', 'lat'],
    lngPath: ['data', 'lng'],
  }

  const createIndex = CreateGeohashIndex(precision, params)

  it('works', async () => {
    await getClient().query(createIndex)

    const doc: values.Document = await getClient().query(
      q.Create(q.Collection('things'), {
        data: {
          lat: 1,
          lng: 1,
        },
      })
    )

    const res: Page<[number, values.Ref]> = await getClient().query(
      q.Paginate(q.Match(q.Index('index')))
    )

    expect(res.data[0][0]).toEqual(3377810978642407)
    expect(res.data[0][1].id).toEqual(doc.ref.id)
  })

  it('can be partially applied', () => {
    const a = JSON.stringify(createIndex)
    const b = JSON.stringify(
      CreateGeohashIndex.withPrecision(precision)(params)
    )

    expect(a).toEqual(b)
  })
})
