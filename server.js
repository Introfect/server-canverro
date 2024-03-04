// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const geocode = require('./geocode'); // assuming you have a geocode module to convert coordinates to location name

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// Define the endpoint for fetching weather data
app.post('/api/weather', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const location = await geocode(latitude, longitude);
    const weatherData = await fetchWeather(latitude, longitude);

    const responseData = {
        location:location,
        temperature: weatherData,
        
        // Additional weather data...
      };
    res.json({data:responseData});
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to fetch weather data from the weather API
async function fetchWeather(lati, lon) {
  // Call your weather API here (replace 'API_KEY' with your actual API key)
  const apiKey = 'M8GBwOXzCekrWf7mhRHQ7EqWZyKn87H2';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${lon}&appid=0b82f6df326d152568ff5ee0bad94aca`
  const response = await axios.get(apiUrl);
  console.log(response,"rs")
//   const { temp_c: temperature, condition: conditions } = response.data.current;
  return  response.data;
}

//Establish WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('A client connected');

  // Fetch weather data every 30 seconds and emit it to the client
  const interval = setInterval(async () => {
    try {
      const weatherData = await fetchWeather(latitude, longitude);
      socket.emit('weatherUpdate', weatherData);
    } catch (error) {
      console.error('Error fetching weather for WebSocket:', error);
      // You may want to handle errors and emit appropriate messages here
    }
  }, 30000);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
