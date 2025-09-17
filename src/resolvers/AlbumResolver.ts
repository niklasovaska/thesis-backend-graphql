import { Album } from "../entity/Album";
import { Artist } from '../entity/Artist';
import { Genre } from '../entity/Genre'
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { AlbumInput } from "../inputs/AlbumInput";
import { GraphQLError } from "graphql";

@Resolver()
export class AlbumResolver {
    @Query(() => [Album])
    async getAllAlbums() {
        return await Album.find({
            relations: ["artist", "genre", "reviews", "tracks"]
        })
    }

    @Query(() => Album)
    async getAlbumById(@Arg("id") id: string): Promise<Album> {
        const album = await Album.findOne({
            relations: ["artist", "genre", "reviews", "tracks"],
            where: { id }
        })
        if(!album) {
            throw new Error(`Album with id ${id} not found`)
        }
        
        return album
    }

    @Mutation(() => Album)
    async createAlbum(@Arg("input") input: AlbumInput): Promise<Album> {
        const { title, year, imageUrl, artistId, genreId } = input

        const artist = await Artist.findOne({ 
            where: { id: artistId }
            }
        )

        if(!artist) {
            throw new GraphQLError("Artist not found", {
                extensions: { code: "BAD_USER_INPUT", field: "artistId" }
            })
        }

        const genre = await Genre.findOne({
            where: { id: genreId }
            }
        )

        if(!genre) {
            throw new GraphQLError("Genre not found", {
                extensions: { code: "BAD_USER_INPUT", field: "genreId" }
            })
        }

        const newAlbum = Album.create({ title, year, imageUrl, artist, genre })

        await newAlbum.save()

        return newAlbum
    }
}