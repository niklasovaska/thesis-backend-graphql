import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm"
import { Artist } from "./Artist"
import { Genre } from "./Genre"
import { Track } from "./Track"
import { Field, ID, Int, ObjectType } from "type-graphql"
import { Review } from "./Review"
import { RatingStats } from "../types/RatingStats"
import slugify from "slugify"

@ObjectType()
@Entity()
export class Album extends BaseEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column("varchar", { length: 255 })
    title!: string

    @Field()
    @Column("varchar" , { unique: true })
    slug!: string

    @Field(() => Int)
    @Column("int")
    year!: number
    
    @Field()
    @Column("varchar", { name: "image_url", length: 255 })
    imageUrl!: string

    @Field(() => Artist)
    @ManyToOne(() => Artist, (artist) => artist.albums)
    @JoinColumn({ name: 'artist_id', referencedColumnName: 'id' })
    artist: Artist

    @Field(() => Genre)
    @ManyToOne(() => Genre, (genre) => genre.albums)
    @JoinColumn({ name: 'genre_id', referencedColumnName: 'id' })
    genre: Genre

    @Field(() => [Track])
    @OneToMany(() => Track, (track) => track.album)
    tracks?: Track[]

    @Field(() => [Review])
    @OneToMany(() => Review, (review) => review.album)
    reviews?: Review[]

    @Field(() => Date)
    @CreateDateColumn({ name: "created_at", type: "timestamp"})
    createdAt!: Date

    @Field(() => RatingStats)
    ratingStats!: RatingStats

    @BeforeInsert()
    generateSlug() {
        this.slug = slugify(this.title, { lower: true })
    }
}
