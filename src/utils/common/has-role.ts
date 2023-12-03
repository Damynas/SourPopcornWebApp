import { IUser } from '..';
import { UserRole } from '../../constants';

type userRole = (typeof UserRole)[keyof typeof UserRole];

const hasRole = (user: IUser | null, role: userRole) => {
  return user?.roles.includes(role);
};

export default hasRole;
