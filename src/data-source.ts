import "reflect-metadata"
import { DataSource } from "typeorm"
import { Artist } from "./entity/Artist"
import { Album } from "./entity/Album"
import { Genre } from "./entity/Genre"
import { AppUser } from "./entity/AppUser"
import { Review } from "./entity/Review"
import { Track } from "./entity/Track"


export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Album, Artist, Genre, AppUser, Review, Track],
    ssl:  { rejectUnauthorized: false },  
    synchronize: true,
})
