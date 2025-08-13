import { IsNotEmpty, IsPositive, IsUUID, MaxLength } from "class-validator";
import { Album } from "../entity/Album";
import { Artist } from '../entity/Artist';
import { Genre } from '../entity/Genre'
import { Arg, Field, ID, InputType, Int, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLError } from "graphql";

@InputType()
class AlbumInput {
    @Field()
    @IsNotEmpty({ message: "Title cannot be empty" })
    @MaxLength(255, { message: "Title can have 255 characters at maximum" })
    title: string

    @Field(() => Int)
    @IsNotEmpty({ message: "Release year cannot be empty" })
    @IsPositive( { message: "Please provide a valid year" })
    year: number

    @Field(() => ID)
    @IsNotEmpty({ message: "Artist id cannot be empty" })
    @IsUUID('4')
    artistId: string

    @Field(() => ID)
    @IsNotEmpty({ message: "Genre id cannot be empty" })
    @IsUUID('4')
    genreId: string

}

@Resolver()
export class AlbumResolver {
    @Query(() => [Album])
    albums() {
        return Album.find({
            relations: ["artist", "genre", "reviews"]
        })
    }

    @Mutation(() => Album)
    async createAlbum(@Arg("input") input: AlbumInput): Promise<Album> {
        const { title, year, artistId, genreId } = input

        const artist = await Artist.findOne({ 
            where: { id: artistId }
            }
        )

        if(!artist) {
            throw new GraphQLError("Artist not found", {
                extensions: { code: "BAD_USER_INPUT", field: "artistId"}
            })
        }

        const genre = await Genre.findOne({
            where: { id: genreId }
            }
        )

        if(!genre) {
            throw new GraphQLError("Genre not found", {
                extensions: { code: "BAD_USER_INPUT", field: "genreId"}
            })
        }

        const newAlbum = Album.create({ title, year, artist, genre})

        await newAlbum.save()

        return newAlbum
    }
}