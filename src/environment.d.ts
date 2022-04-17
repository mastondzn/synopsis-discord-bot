declare namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
        readonly NODE_ENV?: 'development' | 'production';
        readonly EXAMPLE_VAR?: 'EXAMPLE_VALUE';
    }
}
