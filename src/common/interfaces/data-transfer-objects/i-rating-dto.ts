import { type IEntity } from './i-entity';
import { type IVoteDto } from '.';

export interface IRatingDto extends IEntity {
  movieId: number;
  creatorId: number;
  sourPopcorns: number;
  comment: string;
  votes?: IVoteDto[];
}
