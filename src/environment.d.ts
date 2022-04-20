declare namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';
        readonly MONGODB_URL: string;
        readonly MONGODB_DB_NAME: string;
        readonly REDIS_PWD: string;
        readonly REDIS_HOST: string;
        readonly REDIS_PORT: string;
    }
}
