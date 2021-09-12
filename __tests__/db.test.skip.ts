// import { query as q } from 'faunadb'
import { getClient, setup, teardown } from './util'

beforeAll(setup)
// afterAll(teardown)

describe('db', () => {
  it('connects', () =>
    getClient()
      .query(1)
      .then((res) => expect(res).toBe(1)))
})
