import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from 'dotenv'
import { Artist } from "./entity/Artist"
import { Album } from "./entity/Album"
import { Genre } from "./entity/Genre"
import { AppUser } from "./entity/AppUser"
import { Review } from "./entity/Review"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_CONNECT,
    entities: [Album, Artist, Genre, AppUser, Review],
    synchronize: true
})
