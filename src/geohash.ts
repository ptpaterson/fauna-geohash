import { query as q, Expr, ExprArg } from 'faunadb'

import { MAX_PRECISION } from './config'
import { range } from './util'

const { If, LT, Divide, Let, Add, BitOr, ToDouble, Var } = q

const mapLongitudeBinding = (bit: number): ExprArg[] => [
  {
    midpoint: Divide(Add(Var('minLng'), Var('maxLng')), ToDouble(2)),
  },
  {
    result: If(
      LT(Var('lng'), Var('midpoint')),
      Var('result'),
      BitOr(Var('result'), bit)
    ),
  },
  {
    maxLng: If(LT(Var('lng'), Var('midpoint')), Var('midpoint'), Var('maxLng')),
  },
  {
    minLng: If(LT(Var('lng'), Var('midpoint')), Var('minLng'), Var('midpoint')),
  },
]

const mapLatitudeBinding = (bit: number): ExprArg[] => [
  {
    midpoint: Divide(Add(Var('minLat'), Var('maxLat')), ToDouble(2)),
  },
  {
    result: If(
      LT(Var('lat'), Var('midpoint')),
      Var('result'),
      BitOr(Var('result'), bit)
    ),
  },
  {
    maxLat: If(LT(Var('lat'), Var('midpoint')), Var('midpoint'), Var('maxLat')),
  },
  {
    minLat: If(LT(Var('lat'), Var('midpoint')), Var('minLat'), Var('midpoint')),
  },
]

export const generateGeohash = (precision: number): Expr => {
  const bitCalcs = [...range(MAX_PRECISION - 1, MAX_PRECISION - precision, -1)]
    .map((n) => 2 ** n)
    .flatMap((bit, i) =>
      i % 2 === 0 ? mapLongitudeBinding(bit) : mapLatitudeBinding(bit)
    )

  const fql = Let(
    [
      { minLng: -180 },
      { maxLng: 180 },
      { minLat: -90 },
      { maxLat: 90 },
      { result: 0 },
      ...bitCalcs,
    ],
    Var('result')
  )

  return fql
}
