/* esling-disable class-methods-use-this */
import con from '../server/config/mysql';


const IT = 'expenses.items';
const CT = 'expenses.category';
const INT = 'expenses.itemnames';
const FIELDS = ["itemName", "itemQuantity", "itemPrice", "categoryName", "orderID"];

// SELECT itemName, categoryName, itemPrice, itemQuantity, itemTotal, itemPurchaseDate
// FROM expenses.items
// JOIN category ON category.categoryID = items.categoryID
// JOIN itemnames ON itemnames.itemNameID = items.itemNameID

class ItemsController {
    mySQLgetAllItems(req, res) {
        const query = `SELECT itemID, itemName, categoryName, itemPrice, itemQuantity, itemTotal, itemPurchaseDate, orderID
                        FROM expenses.items
                        JOIN category ON category.categoryID = items.categoryID
                        JOIN itemnames ON itemnames.itemNameID = items.itemNameID`;
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

    mySQLgetItem(req, res) {
        const suppliedId = idValidation(req.params.id);

        con.query('SELECT * FROM items WHERE itemId = ?;', suppliedId, (err, result) => {
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

    mySQLcreateItem(req, res) {
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
        //const FIELDS = ["itemName", "itemQuantity", "itemPrice", "categoryName", "orderID"]; `INSERT INTO ${IT} (${FIELDS[0]}, ${FIELDS[1]}, ${FIELDS[2]}) VALUES (?);`
        const values = [req.body.categoryName, req.body.orderID, "%" + req.body.itemName + "%", req.body.itemPrice, req.body.itemQuantity || 1];
        const query = `INSERT INTO ${IT} (categoryID, orderID, itemNameID, itemPrice, itemQuantity) VALUES 
                        ((SELECT categoryID FROM expenses.category WHERE categoryName = ? LIMIT 1),
                        ?,
                        (SELECT itemNameID FROM expenses.itemnames WHERE itemName LIKE ? LIMIT 1),
                        ?,
                        ?);`
        con.query(query, values, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
            return res.status(200).send({
                success: 'true',
                message: 'item added successfully'
            })
        })
    }

    mySQLupdateItem(req, res) {
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
        const values = [itemName, itemQuantity, [req.body.itemPrice]];
        con.query(`UPDATE ${IT} SET ${FIELDS[0]} = ?, ${FIELDS[1]} = ?, ${FIELDS[2]} = ? WHERE itemId = ${suppliedId};`, values, (err, result) => {
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

    mySQLdeleteItem(req, res) {
        const suppliedId = idValidation(req.params.id);

        con.query(`DELETE FROM ${IT} WHERE itemID = ${suppliedId};`, (err, result) => {
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

    mySQLgetTotal(req, res) {
        const targets = ["itemName", "itemQuantity", "itemTotal", "itemnames.itemNameID", "items.itemNameID", "items.itemNameID"]
        const query = `SELECT ??, SUM(??) AS totalQuantity, SUM(??) AS total FROM ${IT}
                        JOIN ${INT} ON ?? = ??
                        GROUP BY ??;`;
        con.query(query, targets, (err, result) => {
            if (err) throw err;
            return res.status(201).send({
                success: 'true',
                message: 'itemTotalgotten',
                result
            });
        })
    }


    // Make API For getting totals of items!
}

function idValidation(id) {
    const suppliedId = parseInt(id, 10);
    if (!suppliedId) {
        return null;
    } else return suppliedId
}

const itemController = new ItemsController();
export default itemController;