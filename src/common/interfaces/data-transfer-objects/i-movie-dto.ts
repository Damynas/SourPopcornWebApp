import { IEntity } from './i-entity';

export interface IMovieDto extends IEntity {
  directorId: number;
  title: string;
  description: string;
  country: string;
  language: string;
  releasedOn: string;
  writers: string[];
  actors: string[];
}
