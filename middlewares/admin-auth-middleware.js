import jwt from 'jsonwebtoken';
import AdminUser from '../models/adminUser.js';

var checkAdminAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1];
      console.log("Token", token);

      // Verify Token
      const { adminuserID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // Get User from Token
      const adminuser = await AdminUser.findById(adminuserID).select('-password');

      if (!adminuser) {
        return res.status(401).json({ status: 'failed', message: 'Unauthorized Admin User' });
      }

      // Check if blacklistedTokens is initialized and includes the token
      const isTokenBlacklisted = adminuser.blacklistedTokens && adminuser.blacklistedTokens.includes(token);

      if (isTokenBlacklisted) {
        return res.status(401).json({ status: 'failed', message: 'Invalid Token. Logout failed.' });
      }

      req.adminuser = adminuser;
      //console.log(req.adminuser);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ status: 'failed', message: 'Unauthorized Admin User' });
    }
  }

  if (!token) {
    res.status(401).json({ status: 'failed', message: 'Unauthorized Admin User, No Token' });
  }
};

export default checkAdminAuth;
