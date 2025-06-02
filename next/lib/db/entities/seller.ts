import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import type { Relation } from 'typeorm'
import {default as Item} from './item';
import {default as Tag} from './tag';
import {WktTransformer, type Point} from '../wkt'

@Entity('NR_seller')
export default class Seller {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 12, nullable: true, unique: true })
  taxpayer_id!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ecommerce_license_no!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  representative_name!: string;

  @Column({ type: 'varchar', length: 255 })
  business_name!: string;

  @Column({ type: 'varchar', length: 20 })
  contact_number!: string;

  @Column({ type: 'timestamp' })
  registration_date!: Date;

  @Column({ type: 'timestamp', default: () => "'1970-01-01 00:00:00'" })
  last_sale_deadline_date!: Date;

  @Column({ type: 'varchar', length: 255 })
  address!: string;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 5179, nullable: true,
    transformer: WktTransformer})
  coord!: Point;

  @OneToMany(() => Item, (item) => item.seller, { cascade: true })
  items!: Relation<Item[]>;

  @ManyToMany(() => Tag, (tag) => tag.sellers)
  @JoinTable({
    name: 'NR_seller_tag',
    joinColumn: {
      name: 'seller_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags!: Relation<Tag[]>;
}