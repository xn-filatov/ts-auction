import { Model, Column, Table, PrimaryKey } from "sequelize-typescript";

@Table({
  timestamps: false,
})
export default class User extends Model<User> {

  @PrimaryKey
  @Column({ autoIncrement: true })
  id!: number;

  @Column
  login!: string;

  @Column
  password!: string;

  @Column
  balance!: number;

}