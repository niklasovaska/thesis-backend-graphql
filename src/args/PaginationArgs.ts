import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class PaginationArgs {
    
    @Field({ nullable: true })
    cursor?: string

    @Field(() => Int, { defaultValue: 10 })
    limit!: number
}


