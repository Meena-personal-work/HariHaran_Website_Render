const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const crackerRoutes = require('./routes/crackerRoutes');
const ordersRouter = require('./routes/ordersRoutes');
const authRouter = require('./routes/authRoutes');       
const authMiddleware = require('./middleware/auth');     

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRouter);

// Apply authMiddleware conditionally
app.use('/api/crackers', (req, res, next) => {
  if (req.method === 'GET' && req.path === '/customer') return next(); // skip
  authMiddleware(req, res, next); // protect all other routes
}, crackerRoutes);

app.use('/api/orders', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/') return next(); // skip
  authMiddleware(req, res, next); // protect all other routes
}, ordersRouter);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
