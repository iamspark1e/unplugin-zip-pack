type Options = {
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
        pre?: () => Promise<void> | void;
        post?: () => Promise<void> | void;
    };
    sep?: string;
};
type FilterFunction = (value: string, index?: number, array?: string[]) => value is string;
type MergedOptions = {
    in: string;
    out: string;
    filter?: FilterFunction;
    enabled: boolean;
    sep: string;
};

export type { FilterFunction, MergedOptions, Options };
