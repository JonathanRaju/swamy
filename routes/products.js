const express = require('express');
const db = require('../db/database');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/:productId', (req, res) => {
    const { productId } = req.params;

    db.all(`SELECT * FROM products WHERE id=?`, [productId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if(rows.length != 0){
            res.json(rows);
            return;
        }
        res.sendStatus(404);
        return;
    });
});

// Create a product (requires admin)
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
    const { title, price, description, category_id, image } = req.body;
    db.run(`INSERT INTO products (title, price, description, category_id, image) VALUES (?, ?, ?, ?, ?)`, [title, price, description, category_id, image], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

module.exports = router;
