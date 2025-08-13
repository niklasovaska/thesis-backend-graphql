import { IsNotEmpty, MaxLength } from "class-validator";
import { GraphQLError } from "graphql"
import { Artist } from "../entity/Artist";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class ArtistInput {
    @Field()
    @IsNotEmpty({ message: "Name cannot be empty" })
    @MaxLength(255, { message: "Name can have 255 characters at maximum" })
    name: string
}

@Resolver()
export class ArtistResolver {
    @Query(() => [Artist])
    artists() {
        return Artist.find({
            relations: ["albums"]
        })
    }

    @Mutation(() => Artist)
    async createArtist(@Arg("input") input: ArtistInput): Promise<Artist> {
        const existingArtist = await Artist.findOne(
            {where: { name: input.name }}
        )

        if(existingArtist) {
            throw new GraphQLError("Artist with this name already exists.")
        }

        const artist = Artist.create()
        Object.assign(artist, input)
        await artist.save()
        return artist 
    }
}