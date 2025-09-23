import express from 'express';
import * as zoneController from '../controllers/zoneController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

/**
 * @route   GET /api/zones
 * @desc    Get all zones for the authenticated user
 * @access  Private
 * @returns {Array} List of zones
 */
router.get('/', zoneController.getAllZones);

/**
 * @route   POST /api/zones
 * @desc    Create a new zone
 * @access  Private
 * @param   {string} name - Name of the zone (required)
 * @param   {string} [description] - Optional description of the zone
 * @param   {Object} [location] - Optional location data
 * @returns {Object} The created zone
 */
router.post('/', zoneController.createZone);

/**
 * @route   GET /api/zones/:id
 * @desc    Get a single zone by ID
 * @access  Private
 * @param   {string} id - Zone ID
 * @returns {Object} Requested zone
 */
router.get('/:id', zoneController.getZone);

/**
 * @route   PATCH /api/zones/:id
 * @desc    Update a zone
 * @access  Private
 * @param   {string} id - Zone ID
 * @param   {Object} updates - Fields to update
 * @returns {Object} Updated zone
 */
router.patch('/:id', zoneController.updateZone);

/**
 * @route   DELETE /api/zones/:id
 * @desc    Delete a zone
 * @access  Private
 * @param   {string} id - Zone ID to delete
 * @returns {null} 204 No Content
 */
router.delete('/:id', zoneController.deleteZone);

export default router;
