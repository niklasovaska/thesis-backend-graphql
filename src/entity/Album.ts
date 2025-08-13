import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Artist } from "./Artist"
import { Genre } from "./Genre"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { Review } from "./Review"

@ObjectType()
@Entity()
export class Album extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column("varchar", { length: 255 })
    title!: string

    @Field(() => Int)
    @Column("int")
    year!: number

    @Field(() => Artist)
    @ManyToOne(() => Artist, (artist) => artist.albums)
    @JoinColumn({name: 'artist_id', referencedColumnName: 'id'})
    artist: Artist

    @Field(() => Genre)
    @ManyToOne(() => Genre, (genre) => genre.albums)
    @JoinColumn({name: 'genre_id', referencedColumnName: 'id'})
    genre: Genre

    @Field(() => [Review], { nullable: true })
    @OneToMany(() => Review, (review) => review.album)
    reviews?: Review[]
}
