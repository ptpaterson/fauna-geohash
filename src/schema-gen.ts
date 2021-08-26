import { query as q, Expr, ExprArg } from 'faunadb'
import { generateGeohash } from './geohash'

const { Select, Let, Lambda, Query, Var, CreateFunction, CreateIndex } = q

export type CreateGeohashIndexParams = {
  name: string
  collection: Expr
  latPath: string[]
  lngPath: string[]
  terms?: ExprArg[]
  values?: ExprArg[]
  data?: { [key: string]: any }
}

export const CreateGeohashIndex = (
  precision: number,
  {
    name,
    collection,
    latPath,
    lngPath,
    terms,
    values,
    data,
  }: CreateGeohashIndexParams
): Expr =>
  CreateIndex({
    name,
    source: {
      collection,
      fields: {
        geohash: Query(
          Lambda(
            'doc',
            Let(
              {
                lat: Select(latPath, Var('doc')),
                lng: Select(lngPath, Var('doc')),
              },
              generateGeohash(precision)
            )
          )
        ),
      },
    },
    terms,
    values: values || [{ binding: 'geohash' }],
    data,
  })

CreateGeohashIndex.withPrecision = (precision: number) =>
  CreateGeohashIndex.bind(null, precision)

export type CreateGeohashFunctionParams = {
  name: string
  data?: { [key: string]: any }
}

export const CreateGeohashFunction = (
  precision: number,
  { name, data }: CreateGeohashFunctionParams
): Expr =>
  CreateFunction({
    name,
    body: Query(Lambda(['lat', 'lng'], generateGeohash(precision))),
    data,
  })

CreateGeohashFunction.withPrecision = (precision: number) =>
  CreateGeohashFunction.bind(null, precision)
