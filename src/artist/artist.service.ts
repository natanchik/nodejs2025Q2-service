import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { artists } from './entities/artist.entity';
import { albums } from '../album/entities/album.entity';
import { favs } from '../favs/entities/fav.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    if (
      'name' in createArtistDto &&
      createArtistDto.name &&
      'grammy' in createArtistDto &&
      typeof createArtistDto.grammy === 'boolean'
    ) {
      const id = uuidv4();
      artists[id] = {
        id: id,
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      };
      return artists[id];
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  findAll() {
    return Object.values(artists);
  }

  findOne(id: string) {
    if (uuidValidate(id)) {
      if (id in artists) {
        return artists[id];
      } else {
        throw new NotFoundException('Artist is not found');
      }
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (uuidValidate(id)) {
      if (id in artists) {
        if (
          'name' in updateArtistDto &&
          updateArtistDto.name &&
          'grammy' in updateArtistDto &&
          typeof updateArtistDto.grammy === 'boolean'
        ) {
          artists[id] = {
            id: id,
            name: updateArtistDto.name,
            grammy: updateArtistDto.grammy,
          };
          return artists[id];
        } else {
          throw new BadRequestException('Request is not correct');
        }
      } else {
        throw new NotFoundException('Artist is not found');
      }
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  remove(id: string) {
    if (uuidValidate(id)) {
      if (id in artists) {
        delete artists[id];
        Object.keys(albums).forEach((albumId) => {
          const album = albums[albumId];
          if (album.artistId === id) {
            album.artistId = null;
          }
        });
        const index = favs.artists.indexOf(id);
        if (index !== -1) {
          favs.artists.splice(index, 1);
        }
      } else {
        throw new NotFoundException('Artist is not found');
      }
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }
}
