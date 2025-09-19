import { Field, ObjectType } from "type-graphql"
import { Album } from "../entity/Album"

@ObjectType()
export class AlbumPaginated {
    @Field(() => [Album])
    items?: Album[]

    @Field()
    hasNextPage!: boolean

    @Field(() => String, { nullable: true })
    nextCursor?: string | null
}