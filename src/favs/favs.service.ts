import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from './entities/fav.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async findAll() {
    const favorites = await this.favoritesRepository.find({
      relations: ['artists', 'albums', 'tracks'],
    });
    return favorites[0] || this.createFavorites();
  }

  async addTrack(id: string): Promise<Favorites> {
    if (uuidValidate(id)) {
      const track = await this.trackRepository.findOne({
        where: { id },
      });
      if (!track) {
        throw new UnprocessableEntityException(`Track doesn't exist`);
      }
      const favorites = await this.findAll();
      favorites.tracks.push(track);
      return this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  async addAlbum(id: string): Promise<Favorites> {
    if (uuidValidate(id)) {
      const album = await this.albumRepository.findOne({
        where: { id },
      });
      if (!album) {
        throw new UnprocessableEntityException(`Album doesn't exist`);
      }
      const favorites = await this.findAll();
      favorites.albums.push(album);
      return this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  async addArtist(id: string): Promise<Favorites> {
    if (uuidValidate(id)) {
      const artist = await this.artistRepository.findOne({ where: { id } });
      if (!artist) {
        throw new UnprocessableEntityException(`Artist doesn't exist`);
      }
      const favorites = await this.findAll();
      favorites.artists.push(artist);
      return this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  async removeTrack(id: string) {
    if (uuidValidate(id)) {
      const favorites = await this.findAll();
      if (!(id in favorites.tracks)) {
        throw new NotFoundException('Track is not found');
      }
      favorites.tracks = favorites.tracks.filter((track) => track.id !== id);
      await this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  async removeAlbum(id: string) {
    if (uuidValidate(id)) {
      const favorites = await this.findAll();
      if (!(id in favorites.albums)) {
        throw new NotFoundException('Album is not found');
      }
      favorites.albums = favorites.albums.filter((album) => album.id !== id);
      await this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  async removeArtist(id: string) {
    if (uuidValidate(id)) {
      const favorites = await this.findAll();
      if (!(id in favorites.artists)) {
        throw new NotFoundException('Artist is not found');
      }
      favorites.artists = favorites.artists.filter(
        (artist) => artist.id !== id,
      );
      await this.favoritesRepository.save(favorites);
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  private async createFavorites(): Promise<Favorites> {
    const newFavorites = this.favoritesRepository.create({
      artists: [],
      albums: [],
      tracks: [],
    });
    return this.favoritesRepository.save(newFavorites);
  }
}
