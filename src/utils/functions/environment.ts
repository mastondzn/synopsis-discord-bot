import dotenv from 'dotenv';
import fs from 'node:fs/promises';

export const lineRegex =
    /^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^\n\r#]+)?\s*(?:#.*)?$/;

/**
 * Reads .env.example for variable keys, for checking purposes
 * @returns Returns an array with all the environment variable keys
 */
export const readEnvironmentVariableKeys = async (): Promise<string[]> => {
    // read .env.example file

    const file = await fs.readFile('.env.example', 'utf8');
    const lines = file.split('\n').filter(Boolean);

    const keys: string[] = [];
    for (const line of lines) {
        const match = line.match(lineRegex);
        if (match) {
            const [, key] = match;
            keys.push(key);
        }
    }

    return keys;
};

/**
 * Checks if environment variables are currently loaded
 * @returns true if all the wanted environment variables are strings
 */
export const checkEnvironmentVariables = async (
    throwOnFail = true,
): Promise<boolean> => {
    const keys = await readEnvironmentVariableKeys();

    let failedAt: string | undefined;
    let ok = true;
    for (const key of keys) {
        if (
            typeof process.env[key] !== 'string' ||
            process.env[key]?.length === 0
        ) {
            ok = false;
            failedAt = key;
            break;
        }
    }

    if (throwOnFail && !ok)
        throw new Error(
            `Environment variables are not loaded (failed at ${
                failedAt ?? 'unknown'
            })`,
        );

    return ok;
};

/** Loads environment variables with dotenv */
export const loadEnvironmentVariables = (throwOnFail = true): void => {
    const result = dotenv.config();

    if (throwOnFail && result.error) throw result.error;
};

/**
 * Loads and checks environment variables using dotenv.
 * @param throwOnFail Choose if this function will throw when it finds that wanted variables are not strings
 * @returns A promise that resolves with true if loading was ok, false otherwise, or rejects with an Error if throwOnFail is true
 */
export const loadAndCheckEnvironmentVariables = async (
    throwOnFail = true,
): Promise<boolean> => {
    loadEnvironmentVariables(throwOnFail);
    const ok = await checkEnvironmentVariables(throwOnFail);

    if (throwOnFail && !ok) {
        throw new Error(
            'Failed to load environment variables or environment variables are not strings.',
        );
    }

    return ok;
};
