import { Client, query as q, values } from 'faunadb'

import getTestConfig from './config'

type FaunaKey = values.Document<{}> & {
  secret: string
}

const testConfig = getTestConfig()

const createClient = (secret: string) =>
  new Client({
    secret,
    domain: testConfig.domain,
    scheme: testConfig.scheme,
    port: testConfig.port,
  })

// Set in before hook, so won't be null during tests
// let _clientDeferred = null
// const _client = new Promise<Client>((resolve, reject) => {
//   _clientDeferred = {
//     resolve,
//     reject,
//   }
// })
let _client: Client = null

function randomString(prefix) {
  const rand = ((Math.random() * 0xffffff) << 0).toString(16)
  return (prefix || '') + rand
}

const rootClient = createClient(testConfig.rootKey)
const dbName = randomString('faunadb-js-test-')

export const setup = async () => {
  console.log('DB Name: ', dbName)
  try {
    await rootClient.query(q.CreateDatabase({ name: dbName }))
    const key: FaunaKey = await rootClient.query(
      q.CreateKey({ database: q.Database(dbName), role: 'admin' })
    )
    // console.log('SECRET: ', key.secret)
    _client = createClient(key.secret)
    // console.log('CLIENT: ', _client)
  } catch (exception) {
    console.error('failed: ' + exception)
  }
}

export const teardown = async () =>
  await rootClient.query(q.Delete(q.Database(dbName)))

export const getClient = () => _client
