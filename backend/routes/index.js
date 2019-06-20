import express from 'express';
import ItemController from '../itemsController/items';

const router = express.Router();



// Create Item
router.post('/api/v1/Items', ItemController.CreateItem);

// Get all Items
router.get('/api/v1/Items', ItemController.GetAllItems);

// Get a single Item
router.get('/api/v1/Items/:id', ItemController.GetItem);

// Update Item
router.put('/api/v1/Items/:id', ItemController.UpdateItem);

// Delete Item
router.delete('/api/v1/Items/:id', ItemController.DeleteItem);

// Get total Spent on item
router.get('/api/v1/GetTotal', ItemController.GetTotal);


export default router;
