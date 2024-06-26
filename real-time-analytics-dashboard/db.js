const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/analytics_db';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const analyticsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  value: Number,
});
const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = { Analytics };