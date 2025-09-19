import { Field, Float, Int, ObjectType } from "type-graphql";


@ObjectType()
export class RatingStats {

    @Field(() => Int)
    oneCount!: number

    @Field(() => Int)
    twoCount!: number

    @Field(() => Int)
    threeCount!: number

    @Field(() => Int)
    fourCount!: number

    @Field(() => Int)
    fiveCount!: number

    @Field(() => Int)
    totalCount!: number

    @Field(() => Float)
    averageRating!: number
}