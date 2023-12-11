import { type IEntity } from './i-entity';
import { type IDirectorDto, type IRatingDto } from '.';

export interface IMovieDto extends IEntity {
  title: string;
  posterLink: string;
  description: string;
  country: string;
  language: string;
  releasedOn: string;
  writers: string[];
  actors: string[];
  sourPopcorns: number;
  director?: IDirectorDto;
  ratings?: IRatingDto[];
}
