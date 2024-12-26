const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const dbURI = 'mongodb+srv://ritikagrawal2002:<db_password>@cluster0.txwha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define the Sales schema and model
const salesSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    name: String,
    address: String,
    typeOfChaff: String,
    rate: Number,
    quantity: Number,
    totalMoney: Number
});

const Sale = mongoose.model('Sale', salesSchema);

// API route to handle form submissions
app.post('/api/submit', async (req, res) => {
    try {
        const { name, address, typeOfChaff, rate, quantity } = req.body;
        const totalMoney = rate * quantity;

        const newSale = new Sale({ name, address, typeOfChaff, rate, quantity, totalMoney });
        await newSale.save();

        // Calculate totals
        const allSales = await Sale.find();
        const totalQuantity = allSales.reduce((sum, sale) => sum + sale.quantity, 0);
        const totalMoneyAll = allSales.reduce((sum, sale) => sum + sale.totalMoney, 0);

        res.json({ message: 'Data submitted successfully.', total_quantity: totalQuantity, total_money: totalMoneyAll });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
