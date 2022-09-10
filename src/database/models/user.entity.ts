import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  email: string;

  @Column({ type: 'char', length: 96 })
  password: string;

  // For testing
  // constructor(data?: Partial<User>) {
  //   this.id = data.id;
  //   this.name = data.name;
  //   this.email = data.email;
  //   this.password = data.password;
  // }
}
