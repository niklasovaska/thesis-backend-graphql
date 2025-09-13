import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { createSchema } from './schema'
import { AppDataSource } from './data-source'
import { PORT, FRONTEND_ORIGIN } from './utils/config'
// import { Artist } from './entity/Artist'
// import { Genre } from './entity/Genre'
// import { Album } from './entity/Album'

async function main() {
  try {
    await AppDataSource.initialize()
    console.log('Connected to database')

    // building GraphQL Schema
    const schema = await createSchema();

    // creating Yoga Server
    const yoga = createYoga({
      schema,
      cors: {
        origin: FRONTEND_ORIGIN,
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'OPTIONS']
      }
    });

    const server = createServer(yoga);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });

  } catch (error) {
    console.error('Error initializing database connection')
  }
}

main()



 