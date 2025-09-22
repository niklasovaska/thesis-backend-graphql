import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm"
import { Album } from '../entity/Album'
import { AppUser } from "../entity/AppUser"
import { Field, ID, Int, ObjectType } from "type-graphql"

@ObjectType()
@Entity()
export class Review extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field(() => Int)
    @Column("int")
    rating!: number

    @Field({ nullable: true })
    @Column("varchar", { length: 255, nullable: true })
    content?: string

    @Field(() => Date)
    @CreateDateColumn({ name: "created_at", type: "timestamp"})
    createdAt!: Date

    @Field(() => Album)
    @ManyToOne(() => Album, (album) => album.reviews)
    @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
    album: Album

    @Field(() => AppUser)
    @ManyToOne(() => AppUser, (user) => user.reviews)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: AppUser
}
