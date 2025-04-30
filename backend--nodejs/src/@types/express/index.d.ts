import { JwtPayload } from 'jsonwebtoken';
import { UserToken } from '../../models/user/user.dto';

declare global {
  namespace Express {
    interface Request {
      user?: UserToken;
    }
  }
}
