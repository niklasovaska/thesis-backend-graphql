import 'reflect-metadata';
import { buildSchema } from 'type-graphql';

import { ArtistResolver } from './resolvers/ArtistResolver';
import { AlbumResolver } from './resolvers/AlbumResolver';
import { GenreResolver } from './resolvers/GenreResolver';
import { AppUserResolver } from './resolvers/AppUserResolver';
import { ReviewResolver } from './resolvers/ReviewResolver';

export async function createSchema() {
  return await buildSchema({
    resolvers: [ArtistResolver, AlbumResolver, GenreResolver, AppUserResolver, ReviewResolver ],
    validate: true
  })
}