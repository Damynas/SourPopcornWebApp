import { type IEntity } from './i-entity';

export interface IDirectorDto extends IEntity {
  name: string;
  country: string;
  bornOn: string;
}
