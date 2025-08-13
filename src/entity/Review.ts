import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { Album } from '../entity/Album'
import { AppUser } from "../entity/AppUser"
import { Field, Float, ID, ObjectType } from "type-graphql"

@ObjectType()
@Entity()
export class Review extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field(() => Float)
    @Column("float")
    rating!: number

    @Field()
    @Column("varchar", {length: 255})
    content!: string

    @Field(() => Album)
    @ManyToOne(() => Album, (album) => album.reviews)
    @JoinColumn({name: 'album_id', referencedColumnName: 'id'})
    album: Album

    @Field(() => AppUser)
    @ManyToOne(() => AppUser, (user) => user.reviews)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: AppUser
}
