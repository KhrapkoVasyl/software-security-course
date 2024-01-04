import { authService } from '../services/auth.service.js';

export const retrieveUserFromJwtPayload = async (req, res, next) => {
  try {
    const jwtPayload = req.auth.payload;
    const { sub: userId } = jwtPayload;

    const user = await authService.getUser({ id: userId });
    req.user = user;
  } catch {
    return res.status(401).send('Unauthorized');
  }

  return next();
};
