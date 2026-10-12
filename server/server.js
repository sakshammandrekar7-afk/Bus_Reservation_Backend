
const express = require('express');
const app = express();

app.use(express.json());

const routeRoutes = require('./routes/routeRoutes');
const busRoutes = require('./routes/busRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.get('/', (req, res) => {
  res.send('Bus Ticket Booking API is running!');
});

app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
