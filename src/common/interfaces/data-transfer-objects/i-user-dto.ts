import { type IEntity } from './i-entity';
import { UserRole } from '../../../constants';

export interface IUserDto extends IEntity {
  username: string;
  displayName: string;
  roles: Array<keyof typeof UserRole>;
}
