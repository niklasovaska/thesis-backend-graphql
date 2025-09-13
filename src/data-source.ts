import "reflect-metadata"
import { DataSource } from "typeorm"
import { Artist } from "./entity/Artist"
import { Album } from "./entity/Album"
import { Genre } from "./entity/Genre"
import { AppUser } from "./entity/AppUser"
import { Review } from "./entity/Review"

import { DB_CONNECT } from "./utils/config"

export const AppDataSource = new DataSource({
    type: "postgres",
    url: DB_CONNECT,
    entities: [Album, Artist, Genre, AppUser, Review],
    synchronize: true
})
