import express from 'express';
import { getAppSettings, updateAppSettings } from '../controllers/appSettingController.js';

const router = express.Router();

// GET /api/app-settings
router.get('/', getAppSettings);

// PUT /api/app-settings
router.put('/', updateAppSettings);

export default router;