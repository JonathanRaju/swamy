const express = require('express');
const db = require('../db/database');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Create a purchase (requires authentication)
router.post('/', authenticateToken, (req, res) => {
    let items;
    db.all(`select * from users where id=?`,[req.user.id],(err,rows)=>{
        console.log("users: "+rows);
    })
    db.all(`select * from carts where id=?`,[req.user.id],(err,rows)=>{
        console.log("carts: "+rows);
    })
    db.all(`select * from cart_items`,[],(err,rows)=>{
        console.log("cart_items: "+cart_items);
    })
    db.all(`select * from products`,[],(err,rows)=>{
        console.log("products: "+products);
    })

    db.all(`SELECT cart_items.product_id AS product_id, cart_items.quantity AS quantity,products.price AS price, cart_items.cart_id AS cart_id
FROM cart_items INNER JOIN products ON cart_items.product_id=products.id WHERE cart_id=(SELECT id FROM carts WHERE user_id=?)`,[req.user.id],(err,rows)=>{
    if (err) return res.status(500).json({ error: err.message });
    console.log(items);
    return res.json({items});
})
    
    // db.run(`INSERT INTO purchases (user_id, total_amount, purchase_date) VALUES (?, ?, datetime('now'))`, [userId, totalAmount], function (err) {
    //     if (err) return res.status(500).json({ error: err.message });
    //     const purchaseId = this.lastID;

    //     // Add items to purchase_items table
    //     const placeholders = items.map(() => '(?, ?, ?, ?)').join(',');
    //     const values = items.flatMap(item => [purchaseId, item.product_id, item.quantity, item.price]);

    //     db.run(`INSERT INTO purchase_items (purchase_id, product_id, quantity, price) VALUES ${placeholders}`, values, (err) => {
    //         if (err) return res.status(500).json({ error: err.message });
    //         res.status(201).json({ purchaseId });
    //     });
    // });
});

// Get purchase by ID (requires authentication)
router.get('/:purchaseId', authenticateToken, (req, res) => {
    const { purchaseId } = req.params;

    db.get(`SELECT * FROM purchases WHERE id = ?`, [purchaseId], (err, purchase) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

        if (req.user.id != purchase.user_id) return res.status(403).json({ error: 'Unauthorized access' });

        db.all(`SELECT * FROM purchase_items WHERE purchase_id = ?`, [purchaseId], (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ purchase, items });
        });
    });
});

module.exports = router;
