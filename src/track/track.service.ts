import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Favorites } from '../favs/entities/fav.entity';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  create(createTrackDto: CreateTrackDto): Promise<Track> {
    if (
      'name' in createTrackDto &&
      createTrackDto.name &&
      'duration' in createTrackDto &&
      typeof createTrackDto.duration === 'number'
    ) {
      const id = uuidv4();
      const newTrack = this.trackRepository.create({
        id: id,
        name: createTrackDto.name,
        artistId: createTrackDto.artistId || null,
        albumId: createTrackDto.albumId || null,
        duration: createTrackDto.duration,
      });
      return this.trackRepository.save(newTrack);
    } else {
      throw new BadRequestException('Request is not correct');
    }
  }

  findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    if (uuidValidate(id)) {
      const track = await this.trackRepository.findOne({ where: { id } });
      if (!track) {
        throw new NotFoundException('Track is not found');
      }
      return track;
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    if (uuidValidate(id)) {
      const track = await this.trackRepository.findOne({ where: { id } });
      if (!track) {
        throw new NotFoundException('Track is not found');
      }
      if (
        'name' in updateTrackDto &&
        updateTrackDto.name &&
        'duration' in updateTrackDto &&
        typeof updateTrackDto.duration === 'number'
      ) {
        await this.trackRepository.update(id, updateTrackDto);
        return this.trackRepository.findOne({ where: { id } });
      } else {
        throw new BadRequestException('Request is not correct');
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }

  async remove(id: string): Promise<void> {
    if (uuidValidate(id)) {
      const track = await this.trackRepository.findOne({ where: { id } });
      if (!track) {
        throw new NotFoundException('Track is not found');
      }
      await this.trackRepository.delete(id);
      const favorites = await this.favoritesRepository.findOne({
        relations: ['tracks'],
      });
      if (favorites) {
        favorites.tracks = favorites.tracks.filter((t) => t.id !== id);
        await this.favoritesRepository.save(favorites);
      }
    } else {
      throw new BadRequestException('Track id is not correct');
    }
  }
}
