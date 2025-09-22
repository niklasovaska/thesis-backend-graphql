## Album collection GraphQL server

- Building a GraphQL server using TypeGraphQL and TypeORM.
- Development is part of the qualitative research for a Bachelor's thesis exploring the differences between GraphQL and REST in full stack development

### Local development setup
- Clone the repository:
```bash
git clone https://github.com/niklasovaska/thesis-backend-graphql.git
```
- Create a new local PostgreSQL database
- Create .env file to the project root adding your PORT number (will default to 4000 if not added) and DB_CONNECT variable in the following format
```bash
DB_CONNECT=postgres://username:password@localhost:port/dbname
PORT=portnumber
```
- Run the development server
```bash
npm run dev
```
- Upon successful launch, the development server should be running with follwing console logs
```bash
Connected to database
Server is running on http://localhost:4000/graphql
```
- Insert test data with a following SQL script. Produced utilizing ChatGPT, the script is inserting 15 genres, 50 artists, 50 albums, 50 app_users, 8-14 tracks per album and 240 reviews (120 with content and 120 without) to the database. 
<details> 
<summary>Test data script</summary>

```sql
DO $$
DECLARE 
  i INT;
  j INT;
  k INT;
  artist_ids UUID[];
  genre_ids UUID[];
  album_id UUID;
  user_ids UUID[];
BEGIN
  -- Insert Genres
  FOR i IN 1..15 LOOP
    INSERT INTO genre (id, name) VALUES (gen_random_uuid(), CONCAT('Genre ', i));
  END LOOP;

  -- Insert Artists
  FOR i IN 1..50 LOOP
    INSERT INTO artist (id, name) VALUES (gen_random_uuid(), CONCAT('Artist ', i));
  END LOOP;

  -- Insert Users
  FOR i IN 1..50 LOOP
    INSERT INTO app_user (id, name) VALUES (gen_random_uuid(), CONCAT('user', LPAD(i::text, 2, '0')));
  END LOOP;

  -- Cache ids
  SELECT array_agg(id ORDER BY name) INTO artist_ids FROM artist;
  SELECT array_agg(id ORDER BY name) INTO genre_ids FROM genre;
  SELECT array_agg(id ORDER BY name) INTO user_ids FROM app_user;

  -- Insert Albums + Tracks
  FOR i IN 1..50 LOOP
    album_id := gen_random_uuid();
    INSERT INTO album (id, title, slug, year, image_url, artist_id, genre_id, created_at)
    VALUES (
      album_id,
      CONCAT('Album ', i),
	  CONCAT('album_', i),
      1970 + (i % 50),
      CONCAT('/album_img_', ((i-1) % 5) + 1, '.png'),
      artist_ids[((i-1) % 50) + 1],
      genre_ids[((i-1) % 15) + 1],
      NOW()
    );

    -- Insert 8–14 tracks per album
    FOR j IN 1..(8 + (random() * 6)::int) LOOP
      INSERT INTO track (id, track_number, title, album_id)
      VALUES (
        gen_random_uuid(),
        j,
        CONCAT('Track ', i, '-', j),
        album_id
      );
    END LOOP;
  END LOOP;

  -- Insert Reviews (120 with content)
  FOR i IN 1..120 LOOP
    INSERT INTO review (id, rating, content, album_id, user_id, created_at)
    VALUES (
      gen_random_uuid(),
      FLOOR(random() * 5 + 1)::int,
      CONCAT('This is review #', i),
      (SELECT id FROM album ORDER BY random() LIMIT 1),
      user_ids[((i-1) % 50) + 1],
      NOW()
    );
  END LOOP;
  
  -- Insert Reviews (120 without content)	
  FOR i IN 1..120 LOOP
    INSERT INTO review (id, rating, album_id, user_id, created_at)
    VALUES (
      gen_random_uuid(),
      FLOOR(random() * 5 + 1)::int,
      (SELECT id FROM album ORDER BY random() LIMIT 1),
      user_ids[((i-1) % 50) + 1],
      NOW()
    );
  END LOOP;
END $$;
```
</details>

### Database class diagram
```mermaid
classDiagram

class Artist {
    +id : uuid
    +name : varchar
}

class Genre {
    +id : uuid
    +name : varchar
}

class Track {
    +id : uuid
    +title : varchar
    +track_number : int
    +album_id : uuid
}

class Album {
    +id : uuid
    +title : varchar
    +slug : varchar
    +year : int
    +artist_id : uuid
    +genre_id : uuid
}

class AppUser {
    +id : uuid
    +name : varchar
}

class Review {
    +id : uuid
    +content? : varchar
    +rating : int
    +album_id : uuid
    +user_id : uuid
}

Artist "1" --> "1..*" Album
Genre "1" --> "1..*" Album
Track "0..*" --> "1" Album
Album "1" --> "0..*" Review
AppUser "1" --> "0..*" Review
```
### GraphQL server architecture
```mermaid
    flowchart TD
        Client[Client]
        GraphQL[GraphQL server]
        TypeORM[TypeORM]
        DB[(Database)]

        Client -->|Query| GraphQL
        GraphQL -->|Calls resolvers| TypeORM
        TypeORM -->|Executes SQL| DB
        DB -->|Returns data| TypeORM
        TypeORM -->|Entities| GraphQL
        GraphQL -->|Response| Client
```