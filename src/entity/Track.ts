import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm"
import { Album } from '../entity/Album'
import { Field, ID, Int, ObjectType } from "type-graphql"

@ObjectType()
@Entity()
export class Track extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field(() => Int)
    @Column({ name: "track_number" })
    trackNumber!: number

    @Field()
    @Column("varchar", { length: 255 })
    title!: string

    @Field(() => Album)
    @ManyToOne(() => Album, (album) => album.tracks)
    @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
    album!: Album

}