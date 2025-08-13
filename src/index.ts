import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { createSchema } from './schema'
import { AppDataSource } from './data-source'
// import { Artist } from './entity/Artist'
// import { Genre } from './entity/Genre'
// import { Album } from './entity/Album'

async function main() {
  try {
    await AppDataSource.initialize()
    console.log('Connected to database')

    // building GraphQL Schema
    const schema = await createSchema();

    // insert test data
    // console.log("Inserting a new artist into the database...")
    // const artist = new Artist()
    // artist.name = "Radiohead"
    // await AppDataSource.manager.save(artist)

    // console.log("Inserting new genres into the database...")
    // const genre1 = new Genre()
    // genre1.name = "Art rock"
    // await AppDataSource.manager.save(genre1)

    // const genre2 = new Genre()
    // genre2.name = "Alternative rock"
    // await AppDataSource.manager.save(genre2)

    // console.log("Inserting new albums into the database...")
    // const album1 = new Album()
    // album1.title = "In Rainbows"
    // album1.year = 2007
    // album1.artist = artist
    // album1.genre = genre1
    // await AppDataSource.manager.save(album1)

    // const album2 = new Album()
    // album2.title = "OK Computer"
    // album2.year = 1997
    // album2.artist = artist
    // album2.genre = genre2
    // await AppDataSource.manager.save(album2)

    // creating Yoga Server
    const yoga = createYoga({
      schema,
    });

    const server = createServer(yoga);

    server.listen(4000, () => {
      console.log('Server is running on http://localhost:4000/graphql');
    });

  } catch (error) {
    console.error('Error initializing database connection')
  }
}

main()



 