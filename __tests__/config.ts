import { cleanEnv, makeValidator, str, host, port } from 'envalid'

type TestConfiguration = {
  domain: string
  scheme: 'http' | 'https'
  port: number
  rootKey: string
}

const scheme = makeValidator((x) => {
  if (x === 'http' || x === 'https') return x
  else throw new Error('Expected "http" or "https"')
})

export default (): TestConfiguration => {
  const env = cleanEnv(process.env, {
    FAUNA_DOMAIN: host(),
    FAUNA_SCHEME: scheme(),
    FAUNA_PORT: port(),
    FAUNA_ROOT_KEY: str({ default: 'secret' }),
  })

  const testConfig: TestConfiguration = {
    domain: env.FAUNA_DOMAIN,
    scheme: env.FAUNA_SCHEME,
    port: env.FAUNA_PORT,
    rootKey: env.FAUNA_ROOT_KEY,
  }

  // console.log(testConfig)

  return testConfig
}
