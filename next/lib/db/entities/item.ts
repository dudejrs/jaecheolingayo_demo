import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import type { Relation } from 'typeorm'
import {default as Seller} from './seller';

@Entity('NR_item')
@Unique(['seller', 'name'])
export default class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'int', nullable: true })
  price!: number;

  @ManyToOne(() => Seller, (seller) => seller.items, { onDelete: 'CASCADE' })
  seller!: Relation<Seller>;
}
