declare namespace NodeJS {
    interface ProcessEnv {
        readonly NODE_ENV: 'development' | 'production';

        readonly MONGO_USERNAME: string;
        readonly MONGO_PASSWORD: string;

        readonly REDIS_PASSWORD: string;

        readonly DISCORD_BOT_AUTH: string;
        readonly DISCORD_BOT_STAGING_AUTH: string;
    }
}
