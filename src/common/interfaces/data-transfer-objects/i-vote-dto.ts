import { type IEntity } from './i-entity';

export interface IVoteDto extends IEntity {
  ratingId: number;
  creatorId: number;
  isPositive: boolean;
}
