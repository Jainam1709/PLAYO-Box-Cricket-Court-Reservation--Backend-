// adminUserRoutes.js
import express from 'express';
const router = express.Router();
import AdminUserController from "../controllers/adminUserController.js";
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

// GET All Admin Users
router.get('/', AdminUserController.getAllAdminUsers);

// GET Admin User by ID
router.get('/:id', AdminUserController.getAdminUserById);

// POST Create/register Admin User
router.post('/registeradmin', AdminUserController.createAdminUser);

// POST Login admin user
router.post('/loginadmin', AdminUserController.adminLogin);

//POST Logout route
router.post('/logoutadmin', checkAdminAuth, AdminUserController.adminLogout);


// PUT Update Admin User by ID
router.put('/:id', AdminUserController.updateAdminUser);

// DELETE Admin User by ID
router.delete('/:id', AdminUserController.deleteAdminUser);

// Route to add new court with turfs
router.post('/addcourt', AdminUserController.addCourt);

// Route to update login credentials
router.put('/updatecredentials', AdminUserController.updateCredentials);

// Route to update ball charges for a turf
router.put('/updateballcharges', AdminUserController.updateBallCharges);

export default router;
