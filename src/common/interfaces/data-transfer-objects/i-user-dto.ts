import { UserRole } from '../../../constants';
import { IEntity } from './i-entity';

export interface IUserDto extends IEntity {
  username: string;
  displayName: string;
  roles: Array<keyof typeof UserRole>;
}
