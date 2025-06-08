import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Favorites } from '../favs/entities/fav.entity';
import { Track } from '../track/entities/track.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  create(createArtistDto: CreateArtistDto): Promise<Artist> {
    if (
      'name' in createArtistDto &&
      createArtistDto.name &&
      'grammy' in createArtistDto &&
      typeof createArtistDto.grammy === 'boolean'
    ) {
      const id = uuidv4();
      const newArtist = this.artistRepository.create({
        id,
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      });
      return this.artistRepository.save(newArtist);
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  findOne(id: string): Promise<Artist> {
    if (uuidValidate(id)) {
      return this.artistRepository.findOne({ where: { id } }).then((artist) => {
        if (!artist) {
          throw new NotFoundException('Artist is not found');
        }
        return artist;
      });
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    if (uuidValidate(id)) {
      const artist = await this.artistRepository.findOne({ where: { id } });
      if (!artist) {
        throw new NotFoundException('Artist is not found');
      }
      if (
        'name' in updateArtistDto &&
        updateArtistDto.name &&
        'grammy' in updateArtistDto &&
        typeof updateArtistDto.grammy === 'boolean'
      ) {
        await this.artistRepository.update(id, updateArtistDto);
        return this.artistRepository.findOne({ where: { id } });
      } else {
        throw new BadRequestException('Request is not correct');
      }
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }

  async remove(id: string): Promise<void> {
    if (uuidValidate(id)) {
      const artist = await this.artistRepository.findOne({ where: { id } });
      if (!artist) {
        throw new NotFoundException('Artist is not found');
      }
      await this.artistRepository.delete(id);
      const favorites = await this.favoritesRepository.findOne({});
      if (favorites) {
        favorites.artists = favorites.artists.filter(
          (artist) => artist.id !== id,
        );
        await this.favoritesRepository.save(favorites);
      }
      await this.albumRepository
        .createQueryBuilder()
        .update(Album)
        .set({ artistId: null })
        .where('artistId = :id', { id })
        .execute();
      await this.trackRepository
        .createQueryBuilder()
        .update(Track)
        .set({ artistId: null })
        .where('artistId = :id', { id })
        .execute();
    } else {
      throw new BadRequestException('Artist id is not correct');
    }
  }
}
