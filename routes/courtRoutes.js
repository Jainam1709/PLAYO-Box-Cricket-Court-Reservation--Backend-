import express from 'express';
const router = express.Router();
import CourtController from '../controllers/courtController.js';
import checkAdminAuth from "../middlewares/admin-auth-middleware.js";

router.post('/', checkAdminAuth, CourtController.createCourt);
router.get('/', checkAdminAuth, CourtController.getCourts);
router.get('/:courtId', checkAdminAuth, CourtController.getCourtById);
router.put('/:courtId',checkAdminAuth, CourtController.updateCourt);
router.delete('/:courtId',checkAdminAuth,CourtController.deleteCourt);

export default router;