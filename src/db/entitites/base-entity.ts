import {
    BaseEntity as CoreEntity,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export abstract class BaseEntity extends CoreEntity<BaseEntity, '_id'> {
    @PrimaryKey()
    _id!: ObjectId;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
