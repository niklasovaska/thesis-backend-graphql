import { AppDataSource } from "../data-source";
import { Album } from "../entity/Album";
import { Artist } from '../entity/Artist';
import { Genre } from '../entity/Genre'
import { Review } from "../entity/Review";
import { RatingStats } from "../types/RatingStats";
import { AlbumPaginated } from "../types/AlbumPaginated";
import { PaginationArgs } from "../args/PaginationArgs";
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { AlbumInput } from "../inputs/AlbumInput";
import { GraphQLError } from "graphql";
import { IsNull, Not } from "typeorm";

@Resolver(() => Album)
export class AlbumResolver {

    @Query(() => AlbumPaginated)
    async getAlbumsPaginated(@Args(){ cursor, limit }: PaginationArgs): Promise<AlbumPaginated> {
        const builder = Album
            .createQueryBuilder("album")
            .leftJoinAndSelect("album.artist", "artist")
            .leftJoinAndSelect("album.genre", "genre")
            .orderBy("album.id", "ASC")
            .take(limit + 1)
        
        if(cursor) {
            builder.where("album.id > :cursor", { cursor })
        }

        const result = await builder.getMany()
        const hasNextPage = result.length > limit
        const items = result.slice(0, limit)

        return {
            items,
            nextCursor: hasNextPage ? items[items.length - 1].id: null,
            hasNextPage
        }
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

    @Query(() => Album)
    async getAlbumBySlug(@Arg("slug") slug: string): Promise<Album> {
        const album = await Album.findOne({
            relations: ["artist", "genre", "reviews", "tracks"],
            where: { slug }
        })
        if(!album) {
            throw new Error(`Album with slug ${slug} not found`)
        }

        return album
    }

    @FieldResolver(() => RatingStats)
    async getRatingStats(@Root() album: Album): Promise<RatingStats> {
        const builder = AppDataSource
            .getRepository(Review)
            .createQueryBuilder("review")
            .select("review.rating", "rating")
            .addSelect("COUNT(*)", "count")
            .where("review.album_id = :albumId", { albumId: album.id })
            .groupBy("review.rating")
        
        const results = await builder
            .getRawMany<{ rating: number; count: string}>()

        const totalStats = {
            oneCount: 0,
            twoCount: 0,
            threeCount: 0,
            fourCount: 0,
            fiveCount: 0,
            totalCount: 0,
            averageRating: 0
        }

        let weightedSum = 0

        results.forEach((res) => {
            const rating = Number(res.rating)
            const count = parseInt(res.count)

            totalStats.totalCount += count
            weightedSum += rating * count

            switch(rating) {
                case 1: totalStats.oneCount = count
                break

                case 2: totalStats.twoCount = count
                break

                case 3: totalStats.threeCount = count
                break
                
                case 4: totalStats.fourCount = count
                break

                case 5: totalStats.fiveCount = count
                break
            }
        })

        totalStats.averageRating = totalStats.totalCount > 0 
                ? weightedSum / totalStats.totalCount : 0

        return totalStats

    }

    @FieldResolver(() => [Review])
    async getReviewsWithContent(@Root() album: Album) {
        return Review.find({
            where: { album: { id: album.id}, content: Not(IsNull())},
            relations: ['user']
        })
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