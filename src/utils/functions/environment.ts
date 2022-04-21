import fs from 'node:fs/promises';

/**
 * Checks if environment variables are currently loaded
 * @returns Returns true if all the wanted environment variables are strings
 */
export const checkEnvironmentVariables = async (): Promise<boolean> => {
    const variableKeys = await readEnvironmentVariableKeys();

    let ok = true;
    for (const variable of variableKeys) {
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
    const ok = await checkEnvironmentVariables();

    if (throwOnFail && !ok) {
        throw new Error(
            'Failed to load environment variables or environment variables are not strings.',
        );
    }

    return ok;
};

/**
 * Reads .env.example for variable keys, for checking purposes
 * @returns Returns an array with all the environment variable keys
 */
export const readEnvironmentVariableKeys = async (): Promise<string[]> => {
    // read .env.example file
    const file = await fs.readFile('.env.example', 'utf8');

    const keys = file
        .split('\n')
        .filter((line) => line.includes('='))
        .map((line) => /^\w+/.exec(line)?.[0])
        .filter((element) => Boolean(element));

    return keys as string[];
};
