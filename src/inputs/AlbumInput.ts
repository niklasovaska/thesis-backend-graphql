import { Field, ID, InputType, Int } from "type-graphql";
import { IsNotEmpty, IsPositive, IsUUID, MaxLength } from "class-validator";

@InputType()
export class AlbumInput {
    @Field()
    @IsNotEmpty({ message: "Title cannot be empty" })
    @MaxLength(255, { message: "Title can have 255 characters at maximum" })
    title!: string

    @Field(() => Int)
    @IsNotEmpty({ message: "Release year cannot be empty" })
    @IsPositive( { message: "Please provide a valid year" })
    year!: number


    @Field()
    @IsNotEmpty({ message: "Image URL cannot be empty" })
    @MaxLength(255, { message: "Image URL can have 255 characters at maximum" })
    imageUrl!: string

    @Field(() => ID)
    @IsNotEmpty({ message: "Artist id cannot be empty" })
    @IsUUID('4')
    artistId!: string

    @Field(() => ID)
    @IsNotEmpty({ message: "Genre id cannot be empty" })
    @IsUUID('4')
    genreId!: string

}