/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * ============== Name Alias ================
 * T (Type) 表示类型
 * K (Key) 表示对象中键的类型
 * V (Value) 表示对象中值的类型
 * E (Element) 表示元素类型
 */

/** 限制参数以 a 开头 */
function foo(str: `a${string}`) {
  return str
}

foo('adas')

/** 条件判断 */
type isTwo<T> = T extends 2 ? true : false

/** 提取元组类型的第一个元素 */
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R] ? T : never
type res = First<[1, 2, 3]>

/** 交叉类型 (intersection) */
type ObjType = { a: number } & { b: string }
type res2 = { a: number; b: string } extends ObjType ? true : false

/** 映射类型 */
type MapType<T> = {
  [Key in keyof T]: [T[Key], T[Key], T[Key]]
}
type res3 = MapType<[1, 2, 3]>
type res4 = MapType<{ a: 1; b: 2 }>

// ---------------------------------------------

/** 获取 value 的类型 */
type GetValueType<P> = P extends Promise<infer T> ? T : never
type res5 = GetValueType<Promise<'bar'>>

/** 提取数组类型的最后一个元素 */
type GetLast<Arr extends unknown[]> =
  Arr extends [...unknown[], infer Last]
    ? Last
    : never

type GetFirstResult = GetLast<[1, 2, 3]>

/** 提取数组类型剩余参数 */
type GetRest<Arr extends unknown[]> =
  Arr extends []
    ? []
    : Arr extends [...infer Rest, unknown]
      ? Rest
      : never

type GetRestResult = GetRest<[1, 2, 3]>

/** StartsWith */
type StartsWith<Str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false
type StartsWithResult = StartsWith<'ab c', 'ab'>

/** Replace */
type Replace<Str extends string, From extends string, To extends string> =
  Str extends `${infer Prefix}${From}${infer Suffix}`
    ? `${Prefix}${To}${Suffix}` : Str

type ReplaceResult = Replace<'Leon', 'on', 'ee'>

/** GetParameters */
type GetParameters<F extends Function> = F extends (...args: infer Args) => unknown ? Args : never
type GetParametersResults = GetParameters<(name: string, age: number) => void>

/** CapitalizeStr */
type CapitalizeStr<Str extends string> = Str extends `${infer F}${infer Rest}` ? `${Uppercase<F>}${Rest}` : Str
type CapitalizeStrResult = CapitalizeStr<'hello'>

/** UppercaseKey */
/********************************
 * TypeScript 提供了内置的高级类型 Record 来创建索引类型 *
 ********************************/
type UppercaseKey<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Uppercase<Key & string> ]: Obj[Key]
}
type UppercaseKeyResult = UppercaseKey<{ name: 'aaa'; age: 32 }>

/** FilterByValueType */
type FilterByValueType<Obj extends Record<string, any>, ValueType> =
  {
    [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key]
  }

interface Person {
  name: string
  age: number
  hobby: string[]
}
type FilterByValueTypeResult = FilterByValueType<Person, string | number>

/** Promise 递归复用 */
type DeepPromiseValuetype<T> = T extends Promise<infer ValueType> ? DeepPromiseValuetype<ValueType> : T
type DeepPromiseValuetypeResult = DeepPromiseValuetype<Promise<Promise<number>>>
// -> 使用 ts 内置高级类型
type AwaitedResult = Awaited<Promise<Promise<string>>>

/** ReverseArr */
type ReverseArr<Arr extends unknown[]> = Arr extends [infer First, ...infer Rest] ? [...ReverseArr<Rest>, First] : Arr
type ReverseArrResult = ReverseArr<[1, 2, 3, 4, 5]>

/** BEM (block__element--modifier) */
type BEM<B extends string, E extends string[], M extends string[]> = `${B}__${E[number]}--${M[number]}`
type BEMResult = BEM<'box', ['top', 'middle', 'bottom'], ['warning', 'success', 'fail']>

/** IsTuple */
/************************
 * 元组类型也是数组类型，但每个元素都是只读的，并且 length 是数字字面量，而数组的 length 是 number
 ************************/
type len = [1, 2, 3]['length']
type len2 = number[]['length']
type IsTuple<T> = T extends readonly [...params:infer Elements] ? NotEqual<Elements['length'], number> : false
type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? false : true
type IsTupleResult = IsTuple<[1, 2, 3]>

/** infer extends */
enum Content {
  a = 'ab',
  b = 2,
  c = '3',
}
type StrToNum<Str> = Str extends `${infer Num extends number}` ? Num : Str
type ContentRes = StrToNum<`${Content}`>

// =========== TypeScript 内置高级类型 ==============

/** Parameters */
type ParametersResult = Parameters<(name: string, age: number) => {}>

/** PartialObjectPropByKeys */
type PartialObjectPropByKeys <
  Obj extends Record<string, any>,
  Key extends keyof any,
> = Partial<Pick<Obj, Extract<keyof Obj, Key>>> & Omit<Obj, Key>

interface Foo {
  name: 'Tim'
  age: 12
  hobboy: ['eat', 'drink']
}

type PartialObjectPropByKeysResult = PartialObjectPropByKeys<Foo, 'name' | 'age'>

// ================= example ======================
/**
 * 实现 ParseQueryString
 */

type ParseParam<Param extends string> =
  Param extends `${infer Key}=${infer Value}`
    ? {
        [K in Key]: Value
      } : Record<string, any>

type MergeValues<One, Other> =
  One extends Other
    ? One
    : Other extends unknown[]
      ? [One, ...Other]
      : [One, Other]

type MergeParams<
  OneParam extends Record<string, any>,
  OtherParam extends Record<string, any>,
> = {
  readonly [Key in keyof OneParam | keyof OtherParam]:
  Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
      ? OtherParam[Key]
      : never
}

type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>

function parseQueryString<Str extends string>(queryStr: Str): ParseQueryString<Str> {
  if (!queryStr || !queryStr.length)
    return {} as any

  const queryObj = {} as any
  const items = queryStr.split('&')
  items.forEach((item) => {
    const [key, value] = item.split('=')
    if (queryObj[key]) {
      if (Array.isArray(queryObj[key]))
        queryObj[key].push(value)

      else
        queryObj[key] = value
    }
  })
  return queryObj as any
}
const result = parseQueryString('a=1&b=2')

/***
 * ================ Type Challenges ==========================
 */

/** Pick --Medium */

interface Todo {
  title: 'hello'
  description: 'someting'
  sort: 2
}

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type MyPickResult = MyPick<Todo, 'title' | 'sort'>

/** ReadOnly --Medium */

type MyReadOnly<T> = {
  readonly [P in keyof T]: T[P]
}

type MyReadOnlyResult = MyReadOnly<Todo>

/** TupleToObject --Difficult */
type TupleToObject<T extends readonly string[]> = {
  [P in T[number]]: P
}

type TupleToObjectResult = TupleToObject<['a', 'b', 'c']>

/** First  --Easy */
type arr = [1, 2, 3]

type MyFirst<T extends unknown[]> = T extends [infer F, ...infer R] ? F : never
type MyFirstResult = MyFirst<arr>

/** TupleLength  --Easy */
type TupleLength<T extends readonly unknown[]> = T['length']
type TupleLengthResult = TupleLength<['a', 'b', 'c']>

/** Exclude --Medium */
type MyExclude<T, U > = T extends U ? never : T
type MyExcludeResult = MyExclude<'a' | 'b' | 'c', 'b' | 'c'>

/** Awaited  --Easy */
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T
type MyAwaitedResult = MyAwaited<Promise<Promise<string>>>

/** IF --Easy */
type IF<C extends boolean, T, F> = C extends true ? T : F
type IFResult = IF<false, 'a', 'b'>

/** Concat --Easy */
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]

type ConcatResult = Concat<[1], [2]>

/** Includes --Medium */
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
type Includes<T extends unknown[], U> = T extends [infer F, ...infer R]
  ? IsEqual<F, U> extends true
    ? true
    : Includes<R, U>
  : false
type IncludesResult = Includes<[1, 2, 3], 1>

/** Push --Easy */
type Push<T extends unknown[], U> = [...T, U]
type PushResult = Push<[1, 2], '3'>

/** Unshift --Easy */
type Unshift<T extends unknown[], U> = [U, ...T]
type UnshiftResult = Unshift<[1, 2], 3>

/** Parameters --Easy */
type MyParameters<F extends Function> = F extends (...arg: infer R) => any ? R : never
type MyParametersResult = MyParameters<(name: 'hello', age: 2) => void>
