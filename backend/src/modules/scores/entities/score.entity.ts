import { Entity, PrimaryColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Decimal transformer - convert string from DB to number
 */
const numberTransformer = {
  to: (entityValue: number | null) => entityValue,
  from: (databaseValue: string | null) => {
    if (databaseValue === null) return null;
    const num = parseFloat(databaseValue);
    return isNaN(num) ? null : num;
  },
};

@Entity('scores')
@Index(['toan'])
@Index(['vat_li'])
@Index(['hoa_hoc'])
@Index(['ngu_van'])
export class Score {
  @PrimaryColumn({ name: 'sbd', type: 'varchar', length: 8 })
  sbd: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  toan: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  ngu_van: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  ngoai_ngu: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  vat_li: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  hoa_hoc: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  sinh_hoc: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  lich_su: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  dia_li: number | null;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, transformer: numberTransformer })
  gdcd: number | null;

  @Column({ name: 'ma_ngoai_ngu', type: 'varchar', length: 5, nullable: true })
  ma_ngoai_ngu: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
