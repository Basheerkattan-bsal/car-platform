require('dotenv').config(); // Adding .env
const express = require('express'); // creates the server
const cookieParser = require('cookie-parser');
const cors = require('cors');
// Adding MongoDB connection
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5050; // Enabling .env variables

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
connectDB(); // This is important once all been coded we need to add this
// Middleware

// Routes

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dealers', require('./routes/dealerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/cars', require('./routes/carPublicRoutes'));
app.use('/api/dealer/cars', require('./routes/carDealerRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

//Test route
app.get('/', (req, res) => {
  res.send('Car Platform API is running');
});

/*debugging*/
app.get('/api/health', (req, res) => {
  return res.status(200).json({ ok: true, service: 'api' });
});
app.use(notFound);
app.use(errorHandler);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
