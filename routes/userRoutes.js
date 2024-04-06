import express from "express";
const router = express.Router();
import UserController from "../controllers/userController.js"
import checkUserAuth from "../middlewares/auth-middleware.js";

//Route level middleware - to protect Routes
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

// Public routes
router.post('/register', UserController.userRegistrtation)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

// Protected routes
router.post('/changepassword', UserController.changeUserPassword)
router.get('/loggeduser', UserController.loggedUser)


// Logout route
router.post('/logout', checkUserAuth, UserController.userLogout);
export default router
