const express = require('express');
const db = require('../db/database');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
    db.all(`SELECT * FROM categories`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
        return;
    });
});

router.get('/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    db.all(`SELECT * FROM categories WHERE id=?`, [categoryId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        if(rows.length != 0){
            res.json(rows);
            return;
        }else{
            res.sendStatus(404);
            return;
        }
    });
});

// Create a category (requires admin)
router.post('/', authenticateToken, authorizeAdmin, (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO categories (name) VALUES (?)`, [name], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

module.exports = router;
