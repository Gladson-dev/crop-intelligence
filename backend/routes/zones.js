import express from 'express';
import * as zoneController from '../controllers/zoneController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(zoneController.getAllZones)
  .post(zoneController.createZone);

router
  .route('/:id')
  .get(zoneController.getZone)
  .patch(zoneController.updateZone)
  .delete(zoneController.deleteZone);

export default router;
