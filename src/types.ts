export type Options = {
  /**
   * Input Dir
   * @default `./dist`
   */
  in?: string;
  /**
   * Output file name (with path)
   * @default `dist.zip`
   */
  out?: string;
  filter?: FilterFunction;
  enabled?: boolean;
  hooks?: {
    pre?: Function;
    post?: Function;
  }
  sep?: string;
}
export type FilterFunction = (value: string, index?: number, array?: string[]) => value is string
export type MergedOptions = {
in: string;
out: string;
filter?: FilterFunction;
enabled: boolean;
sep: string
}