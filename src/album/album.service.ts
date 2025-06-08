import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from '../favs/entities/fav.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (
      'name' in createAlbumDto &&
      createAlbumDto.name &&
      'year' in createAlbumDto &&
      typeof createAlbumDto.year === 'number'
    ) {
      const id = uuidv4();
      const newAlbum = this.albumRepository.create({
        id,
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId ? createAlbumDto.artistId : null,
      });
      return this.albumRepository.save(newAlbum);
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  findOne(id: string): Promise<Album> {
    if (uuidValidate(id)) {
      return this.albumRepository.findOne({ where: { id } }).then((album) => {
        if (!album) {
          throw new NotFoundException('Album is not found');
        }
        return album;
      });
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    if (uuidValidate(id)) {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) {
        throw new NotFoundException('Album is not found');
      }
      if (
        'name' in updateAlbumDto &&
        updateAlbumDto.name &&
        'year' in updateAlbumDto &&
        typeof updateAlbumDto.year === 'number'
      ) {
        await this.albumRepository.update(id, updateAlbumDto);
        return this.albumRepository.findOne({ where: { id } });
      } else {
        throw new BadRequestException('Request is not correct');
      }
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }

  async remove(id: string): Promise<void> {
    if (uuidValidate(id)) {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) {
        throw new NotFoundException('Album is not found');
      }
      await this.albumRepository.delete(id);
      this.trackRepository
        .createQueryBuilder()
        .update(Track)
        .set({ albumId: null })
        .where('albumId = :albumId', { albumId: id })
        .execute();
      this.favoritesRepository
        .createQueryBuilder()
        .update(Favorites)
        .set({ albums: [] })
        .where('albums.id = :albumId', { albumId: id })
        .execute();
    } else {
      throw new BadRequestException('Album id is not correct');
    }
  }
}
