import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Album } from "./Album"
import { Field, ID, ObjectType } from "type-graphql"

@ObjectType()
@Entity()
export class Genre extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column("varchar", { unique: true, length: 255 })
    name!: string

    @Field(() => [Album])
    @OneToMany(() => Album, (album) => album.genre)
    albums?: Album[]
}