import { IsNotEmpty, MaxLength } from "class-validator";
import { Genre } from "../entity/Genre";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLError } from "graphql";

@InputType()
class GenreInput {
    @Field()
    @IsNotEmpty({ message: "Name cannot be empty" })
    @MaxLength(255, { message: "Name can have 255 characters at maximum" })
    name: string

}

@Resolver()
export class GenreResolver {
    @Query(() => [Genre])
    genres() {
        return Genre.find({
            relations: ["albums"]
        })
    }

    @Mutation(() => Genre)
    async createGenre(@Arg("input") input: GenreInput) : Promise<Genre> {
        const existingGenre = await Genre.findOne(
            { where: { name: input.name }}
        )

        if(existingGenre) {
            throw new GraphQLError("Genre with this name already exists", {
                extensions: {
                    code: "BAD_USER_INPUT"
                }
            })
        }

        const genre = Genre.create()
        Object.assign(genre, input)
        await genre.save()
        return genre
    }
}