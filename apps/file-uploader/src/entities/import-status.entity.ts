import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    ticket: string

    @Column()
    status: boolean 
}