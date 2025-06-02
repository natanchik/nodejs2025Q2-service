import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { tracks } from './entities/track.entity';
import { favs } from '../favs/entities/fav.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    if (
      'name' in createTrackDto &&
      createTrackDto.name &&
      'duration' in createTrackDto &&
      typeof createTrackDto.duration === 'number'
    ) {
      const id = uuidv4();
      tracks[id] = {
        id: id,
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null, // refers to Artist
        albumId: createTrackDto.albumId || null, // refers to Album
        duration: createTrackDto.duration, // integer number
      };
      return tracks[id];
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  findAll() {
    return Object.values(tracks);
  }

  findOne(id: string) {
    if (uuidValidate(id)) {
      if (id in tracks) {
        return tracks[id];
      } else {
        throw new NotFoundException('Track is not found');
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (uuidValidate(id)) {
      if (id in tracks) {
        if (
          'name' in updateTrackDto &&
          updateTrackDto.name &&
          'duration' in updateTrackDto &&
          typeof updateTrackDto.duration === 'number'
        ) {
          Object.keys(updateTrackDto).forEach((key) => {
            tracks[id][key] = updateTrackDto[key];
          });
          return tracks[id];
        } else {
          throw new BadRequestException('Request is not correct');
        }
      } else {
        throw new NotFoundException('Track is not found');
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  remove(id: string) {
    if (uuidValidate(id)) {
      if (id in tracks) {
        delete tracks[id];
        const index = favs.tracks.indexOf(id);
        if (index !== -1) {
          favs.tracks.splice(index, 1);
        }
      } else {
        throw new NotFoundException('Track is not found');
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }
}
