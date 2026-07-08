import AuthenticateServices from '../services/auth.services.js';
import { ErrorCodesMeta, SuccessCodesMeta } from '../constants/index.js'; 

class AuthController{
  async register(req, res) {
    try {
      const userData = req.body;
      const result = await AuthenticateServices.register(userData);

      // Use predefined CREATED success metadata
      res.status(201).json({
        success: true,
        code: SuccessCodesMeta.CREATED.code,
        message: SuccessCodesMeta.CREATED.message,
        data: result
      });
    } catch (error) {
      // Fallback check if it's an existing user error
      const isExistError = error.message.includes('exists');
      const errorMeta = isExistError ? ErrorCodesMeta.USER_ALREADY_EXISTS : ErrorCodesMeta.BAD_REQUEST;

      res.status(400).json({
        success: false,
        code: errorMeta.code,
        message: error.message || errorMeta.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthenticateServices.login(email, password);

      // Use predefined SUCCESS metadata
      res.status(200).json({
        success: true,
        code: SuccessCodesMeta.SUCCESS.code,
        message: 'Login successfully',
        ...result
      });
    } catch (error) {
      // Check what kind of error happened to provide the perfect error code
      let errorMeta = ErrorCodesMeta.INVALID_CREDENTIALS;
      
      if (error.message.includes('password')) {
        errorMeta = ErrorCodesMeta.YOUR_PASSWORD_IS_INCORRECT;
      } else if (error.message.includes('exist')) {
        errorMeta = ErrorCodesMeta.USER_NOT_EXISTS_WITH_THIS_EMAIL;
      }

      res.status(401).json({
        success: false,
        code: errorMeta.code,
        message: error.message || errorMeta.message
      });
    }
  }
// refresh the access token after getting expired
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        code: SuccessCodesMeta.SUCCESS.code,
        ...result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        code: ErrorCodesMeta.UNAUTHORIZED.code,
        message: error.message || ErrorCodesMeta.UNAUTHORIZED.message
      });
    }
  }
};

export default  new AuthController();