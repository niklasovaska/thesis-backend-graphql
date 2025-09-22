import { IsNotEmpty, IsUUID, Min, Max, MaxLength } from "class-validator";
import { Album } from "../entity/Album";
import { Review } from '../entity/Review';
import { AppUser } from '../entity/AppUser';
import { Arg, Field, Float, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLError } from "graphql";

@InputType()
class ReviewInput {
    @Field()
    @IsNotEmpty({ message: "Review content cannot be empty" })
    @MaxLength(255, { message: "Review content can have 255 characters at maximum" })
    content: string

    @Field(() => Float)
    @IsNotEmpty({ message: "Rating cannot be empty" })
    @Min(0.5,  { message: "Please provide a valid rating" })
    @Max(5, { message: "Please provide a valid rating"  })
    rating: number

    @Field(() => ID)
    @IsNotEmpty({ message: "Album id cannot be empty" })
    @IsUUID('4')
    albumId: string

    @Field(() => ID)
    @IsNotEmpty({ message: "User id cannot be empty" })
    @IsUUID('4')
    userId: string

}

@Resolver(() => Review)
export class ReviewResolver {
    @Query(() => [Review])
    getReviews() {
        return Review.find({
            relations: ["album", "user"]
        })
    }

    @Mutation(() => Review)
    async createReview(@Arg("input") input: ReviewInput) : Promise<Review> {
        const { content, rating, albumId, userId } = input

        const album = await Album.findOne({
            where: { id: albumId}
        })

        if(!album) {
            throw new GraphQLError("Album not found", {
                extensions: { code: "BAD_USER_INPUT", field: "albumId"}
            })
        }

        const user = await AppUser.findOne({
            where: { id: userId}
        })

        if(!user) {
            throw new GraphQLError("User not found", {
                extensions: { code: "BAD_USER_INPUT", field: "userId"}
            })
        }

        const newReview = Review.create({content, rating, album, user})

        await newReview.save()

        return newReview
    }

}