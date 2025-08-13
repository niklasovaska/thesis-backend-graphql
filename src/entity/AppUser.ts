import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { Review } from './Review'
import { Field, ID, ObjectType } from "type-graphql"


@ObjectType()
@Entity({ name: 'app_user'})
export class AppUser extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Field()
    @Column("varchar", {unique: true, length: 20})
    name!: string

    @Field(() => [Review], { nullable: true })
    @OneToMany(() => Review, (review) => review.user)
    reviews?: Review[]
}