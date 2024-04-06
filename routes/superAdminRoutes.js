// superAdminRoutes.js
import express from 'express';
const router = express.Router();
// import {
//   getSuperAdmin,
//   getSuperAdminById,
//   createSuperAdmin,
// } from '../controllers/superAdminController';
//import superAdminController from '../controllers/superAdminController.js';

import { createSuperAdmin } from "../controllers/superAdminController.js";
import { getSuperAdminById } from "../controllers/superAdminController.js";
import { getSuperAdmin } from "../controllers/superAdminController.js";



// GET Super Admin details
router.get('/get', getSuperAdmin);

// GET Super Admin by ID
router.get('/:id', getSuperAdminById);

// POST Create Super Admin
router.post('/createsuperadmin', createSuperAdmin);

export default router;
