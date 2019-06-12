import express from 'express';
import ItemController from '../itemsController/items';

const router = express.Router();



// Create Item
router.post('/api/v1/mySQLitems', ItemController.mySQLcreateItem);

// Get all Items
router.get('/api/v1/mySQLitems', ItemController.mySQLgetAllItems);


// Get a single Item
router.get('/api/v1/mySQLitems/:id', ItemController.mySQLgetItem);

// Update Item
router.put('/api/v1/mySQLitems/:id', ItemController.mySQLupdateItem);

// Delete Item
router.delete('/api/v1/mySQLitems/:id', ItemController.mySQLdeleteItem);

// Get total Spent on item
router.get('/api/v1/mySQLgetTotal', ItemController.mySQLgetTotal);


export default router;
