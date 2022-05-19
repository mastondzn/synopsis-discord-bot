import { Console } from 'node:console';
import { Transform } from 'node:stream';

const transform = new Transform({
    transform(chunk, _enc, callback) {
        callback(null, chunk);
    },
});

transform.setEncoding('utf8');

const consoleLike = new Console({ stdout: transform });

export const makeConsoleLikeTable = (data: unknown): string => {
    consoleLike.table(data);
    return ((transform.read() as string) || '')?.toString();
};
