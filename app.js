const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const cartsRoutes = require('./routes/carts');
const inventoryRoutes = require('./routes/inventory');
const purchasesRoutes = require('./routes/purchases');
const useresRoutes = require('./routes/users');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/carts', cartsRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/purchases', purchasesRoutes);
app.use('/users',useresRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
