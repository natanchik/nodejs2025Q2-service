import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Track } from './track/entities/track.entity';
import { Favorites } from './favs/entities/fav.entity';
import { Album } from './album/entities/album.entity';
import { Artist } from './artist/entities/artist.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'myUser',
  password: process.env.DATABASE_PASSWORD || 'myPassword',
  database: process.env.DATABASE_NAME || 'myPostgres',
  synchronize: false,
  logging: true,
  entities: [User, Track, Favorites, Album, Artist],
  migrations: ['src/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((error) => console.log(error));
