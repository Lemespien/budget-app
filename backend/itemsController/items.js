/* esling-disable class-methods-use-this */
import con from '../server/config/mysql';
import mysql from 'mysql';


const IT = 'expenses.items';
const CT = 'expenses.category';
const INT = 'expenses.itemnames';


class ItemsController {
    GetAllItems(req, res) {
        let query = 'SELECT ??, ??, ??, ??, ??, ??, ??, ?? FROM ?? JOIN category ON category.categoryID = items.categoryID JOIN itemnames ON itemnames.itemNameID = items.itemNameID';
        const inserts = ['itemID', 'itemName', 'categoryName', 'itemPrice', 'itemQuantity', 'itemTotal', 'itemPurchaseDate', 'orderID', IT];

        query = mysql.format(query, inserts);

        con.query(query, (err, result) => {
            if (err) throw err;
            console.log(`Retrieved: ${result.length} items from the database`);
            return res.status(200).send({
                success: 'true',
                message: 'todos retrieved successfully',
                result
            });
        });
    }

    GetItem(req, res) {
        const suppliedId = idValidation(req.params.id);
        const inserts = ['items', suppliedId];

        let query = 'SELECT * FROM ?? WHERE itemId = ?';

        query = mysql.format(query, inserts);

        con.query(query, (err, result) => {
            if (!result) {
                return res.status(404).send({
                    success: 'false',
                    message: 'item does not exist',
                });
            }
            if (result.length > 0) {
                return res.status(200).send({
                    success: 'true',
                    message: 'item retrieved successfully',
                    result,
                });
            } else {
                return res.status(404).send({
                    success: 'false',
                    message: 'item does not exist',
                });
            }
        })
    }

    CreateItem(req, res) {
        /*
                SOMETHING HERE WENT WRONG

        */

        // if (!req.body.itemName) {
        //     return res.status(400).send({
        //         success: 'false',
        //         message: 'item name is required',
        //     });
        // }
        // if (!req.body.itemPrice) {
        //     return res.status(400).send({
        //         success: 'false',
        //         message: 'item price is required',
        //     });
        // }
        // if (!Number.isInteger(req.body.itemPrice)) {
        //     return res.status(400).send({
        //         success: 'false',
        //         message: 'item price is not a number',
        //     });
        // }
        const itemName = "%" + req.body.itemName.toString() + "%";
        const itemQuantity = req.body.itemQuantity || 1;

        let query = `INSERT INTO ?? (categoryID, orderID, itemNameID, itemPrice, itemQuantity) VALUES 
                ((SELECT ?? FROM ?? WHERE ?? = ? LIMIT 1),
                ?,
                (SELECT ?? FROM ?? WHERE ?? LIKE ? LIMIT 1),
                ?,
                ?);`
        const inserts = [
            IT, 'categoryID', 'expenses.category', 'categoryName', req.body.categoryName, req.body.orderID,
            'itemNameID', 'expenses.itemnames', 'itemName', itemName,
            req.body.itemPrice, itemQuantity
        ];

        query = mysql.format(query, inserts);
        con.query(query, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
            return res.status(200).send({
                success: 'true',
                message: 'item added successfully'
            })
        })
    }

    UpdateItem(req, res) {
        const suppliedId = idValidation(req.params.id);

        if (!req.body.itemName) {
            return res.status(400).send({
                success: 'false',
                message: 'item name is required',
            });
        }
        if (!req.body.itemPrice) {
            return res.status(400).send({
                success: 'false',
                message: 'item price required',
            })
        }
        // if (!Number.isInteger(req.body.itemPrice)) {
        //     return res.status(400).send({
        //         success: 'false',
        //         message: 'item price is not a number',
        //     });
        // }
        const itemName = req.body.itemName.toString();
        const itemQuantity = req.body.itemQuantity || 1;
        let query = `UPDATE ?? SET 
                    ?? = (SELECT ?? FROM ?? WHERE ?? = ? LIMIT 1),
                    ?? = ?,
                    ?? = (SELECT ?? FROM ?? WHERE ?? LIKE ? LIMIT 1), 
                    ?? = ?, 
                    ?? = ? 
                    WHERE ?? = ?;`
        const inserts = [
            IT, 'categoryID', 'categoryID', 'expenses.category', 'categoryName', req.body.categoryName,
            'orderID', req.body.orderID, 'itemNameID', 'itemNameID', 'expenses.itemnames', 'itemName', "%" + itemName + "%",
            'itemQuantity', itemQuantity, 'itemPrice', req.body.itemPrice, 'itemId', suppliedId
        ];
        query = mysql.format(query, inserts);
        con.query(query, (err, result) => {
            if (err) throw err;
            if (result.affectedRows <= 0) {
                return res.status(404).send({
                    success: 'false',
                    message: 'item not found',
                });
            }
            console.log("item updated");
            return res.status(201).send({
                success: 'true',
                message: 'item updated successfully',
            });
        })

    }

    DeleteItem(req, res) {
        const suppliedId = idValidation(req.params.id);

        let query = "DELETE FROM ?? WHERE ?? = ?;";
        const inserts = [IT, 'itemID', suppliedId]
        query = mysql.format(query, inserts);

        con.query(query, (err, result) => {
            if (err) throw err;

            if (result.affectedRows <= 0) {
                return res.status(404).send({
                    success: 'false',
                    message: 'item not found',
                });
            }
            console.log("Successfully deleted item");
            return res.status(200).send({

                success: 'true',
                message: 'item deleted successfully',
            });
        })
    }

    GetTotal(req, res) {
        let query = `SELECT ??, SUM(??) AS totalQuantity, SUM(??) AS total FROM ??
            JOIN ${INT} ON ?? = ??
            GROUP BY ??;`;
        const inserts = ["itemName", "itemQuantity", "itemTotal", IT, "itemnames.itemNameID", "items.itemNameID", "items.itemNameID"]
        query = mysql.format(query, inserts);
        con.query(query, (err, result) => {
            if (err) throw err;
            return res.status(201).send({
                success: 'true',
                message: 'itemTotalgotten',
                result
            });
        })
    }
}

function idValidation(id) {
    const suppliedId = parseInt(id, 10);
    if (!suppliedId) {
        return null;
    } else return suppliedId
}

const itemController = new ItemsController();
export default itemController;