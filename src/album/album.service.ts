import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { albums } from './entities/album.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    if (
      'name' in createAlbumDto &&
      createAlbumDto.name &&
      'year' in createAlbumDto &&
      typeof createAlbumDto.year === 'number'
    ) {
      const id = uuidv4();
      albums[id] = {
        id: id,
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId ? createAlbumDto.artistId : null,
      };
      return albums[id];
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  findAll() {
    return Object.values(albums);
  }

  findOne(id: string) {
    if (uuidValidate(id)) {
      if (id in albums) {
        return albums[id];
      } else {
        throw new NotFoundException('Album is not found');
      }
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (uuidValidate(id)) {
      if (id in albums) {
        if (
          'name' in updateAlbumDto &&
          updateAlbumDto.name &&
          'year' in updateAlbumDto &&
          typeof updateAlbumDto.year === 'number'
        ) {
          albums[id] = {
            id: id,
            name: updateAlbumDto.name,
            year: updateAlbumDto.year,
            artistId: updateAlbumDto.artistId ? updateAlbumDto.artistId : null,
          };
          return albums[id];
        } else {
          throw new BadRequestException('Request is not correct');
        }
      } else {
        throw new NotFoundException('Album is not found');
      }
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  remove(id: string) {
    if (uuidValidate(id)) {
      if (id in albums) {
        delete albums[id];
      } else {
        throw new NotFoundException('Album is not found');
      }
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }
}
