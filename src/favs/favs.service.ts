import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { favs } from './entities/fav.entity';
import { artists } from 'src/artist/entities/artist.entity';
import { albums } from 'src/album/entities/album.entity';
import { tracks } from 'src/track/entities/track.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class FavsService {
  findAll() {
    return {
      artists: [...favs.artists.map((id) => artists[id])],
      albums: [...favs.albums.map((id) => albums[id])],
      tracks: [...favs.tracks.map((id) => tracks[id])],
    };
  }

  addTrack(id: string) {
    if (uuidValidate(id)) {
      if (id in tracks) {
        favs.tracks = [...new Set(...favs.tracks, id)];
        return tracks[id];
      } else {
        throw new UnprocessableEntityException(`Track doesn't exist`);
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  addAlbum(id: string) {
    if (uuidValidate(id)) {
      if (id in albums) {
        favs.albums = [...new Set(...favs.albums, id)];
        return albums[id];
      } else {
        throw new UnprocessableEntityException(`Album doesn't exist`);
      }
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  addArtist(id: string) {
    if (uuidValidate(id)) {
      if (id in artists) {
        favs.artists = [...new Set(...favs.artists, id)];
        return artists[id];
      } else {
        throw new UnprocessableEntityException(`Artist doesn't exist`);
      }
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  removeTrack(id: string) {
    if (uuidValidate(id)) {
      if (id in favs.tracks) {
        delete favs.tracks[id];
      } else {
        throw new NotFoundException('Track is not found');
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  removeAlbum(id: string) {
    if (uuidValidate(id)) {
      if (id in favs.albums) {
        delete favs.albums[id];
      } else {
        throw new NotFoundException('Album is not found');
      }
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  removeArtist(id: string) {
    if (uuidValidate(id)) {
      if (id in favs.artists) {
        delete favs.artists[id];
      } else {
        throw new NotFoundException('Artist is not found');
      }
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }
}
