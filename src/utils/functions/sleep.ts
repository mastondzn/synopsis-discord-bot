/**
 *  Use in async function to sleep the given amount of time in seconds.
 */
export const sleep = <T extends string>(
    seconds: number,
    anything?: T,
): Promise<T | void> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(anything), seconds * 1000);
    });
};
