import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Field, ID, ObjectType } from "type-graphql"
import { Album } from "./Album"

@ObjectType()
@Entity()
export class Artist extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column("varchar", { unique: true, length: 255 })
    name!: string

    @Field(() => [Album], { nullable: true })
    @OneToMany(() => Album, (album) => album.artist)
    albums?: Album[]
}