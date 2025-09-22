import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { createSchema } from './schema'
import { AppDataSource } from './data-source'
import { PORT, FRONTEND_ORIGIN } from './utils/config'

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

    const port = PORT || 4000

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}/graphql`);
    });

  } catch (error) {
    console.error('Error initializing database connection')
  }
}

main()



 