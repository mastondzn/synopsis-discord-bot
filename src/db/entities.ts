import * as objectOfEntities from './entitites/index';

type Keys = keyof typeof objectOfEntities;
type Entity = typeof objectOfEntities[Keys];

export const entities = Object.keys(objectOfEntities).map(
    // @ts-expect-error -> using this seems fine here
    // because typescript doesn't realize that we are actually safely looping the object's keys
    (key) => objectOfEntities[key] as Entity,
);
