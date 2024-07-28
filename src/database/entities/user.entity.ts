import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public first_name: string;

    @Column()
    public last_name: string;

    @Column()
    public email: string;

    @Column({select: false})
    public password: string;

    @CreateDateColumn()
    public created_at?: string;

    @UpdateDateColumn()
    public updated_at?: string;
}

export default User;
