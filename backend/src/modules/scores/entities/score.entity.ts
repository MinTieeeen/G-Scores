import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('scores')
export class Score {
  @PrimaryColumn({ name: 'sbd' })
  sbd: string;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  toan: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ngu_van: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ngoai_ngu: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  vat_li: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  hoa_hoc: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  sinh_hoc: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  lich_su: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  dia_li: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  gdcd: number;

  @Column({ name: 'ma_ngoai_ngu', nullable: true })
  ma_ngoai_ngu: string;
}
