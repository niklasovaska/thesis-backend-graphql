import 'reflect-metadata'
import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { createSchema } from './schema'
import { AppDataSource } from './data-source'

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
        origin: '*',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'OPTIONS']
      }
    });

    const server = createServer(yoga);

    const PORT = process.env.PORT || 4000

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error initializing database connection')
  }
}

main()



 