import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import type { Relation } from 'typeorm'
import { default as Seller } from './seller';

@Entity('NR_tag')
export default class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name!: string;

  @ManyToMany(() => Seller, (seller) => seller.tags)
  sellers!: Relation<Seller[]>;
}
