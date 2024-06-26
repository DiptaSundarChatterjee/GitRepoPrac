const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { Analytics } = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(bodyParser.json());


app.use(express.static('public'));

app.get('/analytics', async (req, res) => {
  try {
    const analyticsData = await Analytics.find().sort({ timestamp: -1 }).limit(10);
    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/analytics', async (req, res) => {
  try {
    const { value } = req.body; 
    const newAnalyticsData = new Analytics({ value });
    await newAnalyticsData.save();
    
    
    io.emit('analyticsUpdate', newAnalyticsData);
    
    res.status(201).json(newAnalyticsData);
  } catch (error) {
    console.error('Error adding analytics:', error);
    res.status(500).json({ error: 'Failed to add analytics data' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');


  setInterval(async () => {
    const analyticsData = await Analytics.find().sort({ timestamp: -1 }).limit(1);
    socket.emit('analyticsUpdate', analyticsData[0]);
  }, 1000); 

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
