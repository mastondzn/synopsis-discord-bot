//  TODO: if we change the environment variables this file should change too

/**
 * Checks if environment variables are currently loaded
 * @returns Returns true if all the wanted environment variables are strings
 */
export const checkEnvironmentVariables = (): boolean => {
    const variables = [
        'NODE_ENV',
        'MONGODB_DB_NAME',
        'MONGODB_URL',
        'REDIS_HOST',
        'REDIS_PORT',
        'REDIS_PWD',
    ];

    let ok = true;

    for (const variable of variables) {
        if (typeof process.env[variable] !== 'string') ok = false;
    }

    return ok;
};

/** Loads environment variables with dotenv */
export const loadEnvironmentVariables = async (): Promise<void> => {
    const dotenv = await import('dotenv');
    dotenv.config();
};

/**
 * Loads and checks environment variables using dotenv.
 * @param throwOnFail Choose if this function will throw when it finds that wanted variables are not strings
 * @returns A promise that resolves with true if loading was ok, false otherwise, or rejects with an Error if throwOnFail is true
 */
export const loadAndCheckEnvironmentVariables = async (
    throwOnFail = true,
): Promise<boolean> => {
    await loadEnvironmentVariables();
    const ok = checkEnvironmentVariables();

    if (throwOnFail && !ok) {
        throw new Error(
            'Failed to load environment variables or environment variables are not strings.',
        );
    }

    return ok;
};
