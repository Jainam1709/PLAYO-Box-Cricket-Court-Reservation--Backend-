import express from 'express';
const router = express.Router();
import TurfController from '../controllers/turfController.js';
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

router.get('/:courtId/turfs', checkAdminAuth, TurfController.getAllTurfs);
router.post('/:courtId/turfs', checkAdminAuth, TurfController.addTurf);
router.get('/:courtId/turfs/:turfId', checkAdminAuth, TurfController.getTurfById);
router.put('/:courtId/turfs/:turfId', checkAdminAuth, TurfController.updateTurf);
router.delete('/:courtId/turfs/:turfId', checkAdminAuth, TurfController.deleteTurf);

export default router;
