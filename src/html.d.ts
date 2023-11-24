type Children =
  | number
  | string
  | Promise<string>
  | boolean
  | null
  | undefined
  | Children[];

type PropsWithChildren<T = {}> = {
  children?: Children;
} & T;