import { Model, Column, Table, PrimaryKey, CreatedAt } from "sequelize-typescript";

@Table
export default class Bid extends Model<Bid> {

  @PrimaryKey
  @Column({ autoIncrement: true })
  id!: number;

  @Column
  name!: string;

  @Column
  startPrice!: number;

  @Column
  duration!: number;

  @CreatedAt
  @Column
  createdAt!: Date;
}