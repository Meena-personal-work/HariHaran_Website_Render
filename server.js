// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();
// const crackerRoutes = require('./routes/crackerRoutes');
// const ordersRouter = require('./routes/ordersRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error(err));

// app.use('/api/crackers', crackerRoutes);
// app.use('/api/orders', ordersRouter);

// app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns'); // ✅ added

dotenv.config();

// ✅ Force Node to use public DNS resolvers so the
// _mongodb._tcp SRV lookup doesn't fail like it did before
// (Compass uses a different resolver path, which is why it worked there but not here)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const crackerRoutes = require('./routes/crackerRoutes');
const ordersRouter = require('./routes/ordersRoutes');

const app = express();
app.set('trust proxy', 1); // ✅ added — needed so req.protocol is correct behind Render/Railway/etc (fixes the image URL issue too)

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 15000, // ✅ added — fail in ~15s instead of hanging forever
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

app.use('/api/crackers', crackerRoutes);
app.use('/api/orders', ordersRouter);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));