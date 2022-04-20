import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from './base-entity';

@Entity()
export class TestUser extends BaseEntity {
    @Property()
    name!: string;
}
