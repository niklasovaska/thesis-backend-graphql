import { IsNotEmpty, MaxLength } from "class-validator";
import { GraphQLError } from "graphql"
import { AppUser } from "../entity/AppUser";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class UserInput {
    @Field()
    @IsNotEmpty({ message: "Name cannot be empty" })
    @MaxLength(20, { message: "Name can have 20 characters at maximum" })
    name: string
}

@Resolver()
export class AppUserResolver {
    @Query(() => [AppUser])
    users() {
        return AppUser.find({
            relations: ["reviews"]
        })
    }

    @Mutation(() => AppUser)
    async createUser(@Arg("input") input: UserInput): Promise<AppUser> {
        const existingUser = await AppUser.findOne(
            {where: { name: input.name }}
        )

        if(existingUser) {
            throw new GraphQLError("User with this name already exists.")
        }

        const username = AppUser.create()
        Object.assign(username, input)
        await username.save()
        return username 
    }
}