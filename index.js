/**
 * API to get list of Hotels and filtered with location query param
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load hotel data from hotels.json file
const hotelsDataPath = path.join(__dirname, 'data', 'hotels.json');

// Get list of hotels
const getHotels = () => {
  const hotels = fs.readFileSync(hotelsDataPath);
  return JSON.parse(hotels);
};

// Hotel listing route
app.get('/hotel-room-booking/hotels', (req, res) => {
  try {
    const hotels = getHotels();
    
    // Filter by location if 'location' query parameter is provided
    const { location } = req.query;
    let filteredHotels = hotels;

    if (location) {
      filteredHotels = hotels.filter(hotel => hotel.location.toLowerCase() === location.toLowerCase());
    }

    // Response structure
    const response = {
      status: "success",
      message: filteredHotels.length > 0 ? "Hotels found" : "No hotels found",
      data: {
        hotels: filteredHotels,
        count: filteredHotels.length
      }
    };

    return res.json(response);
  } catch (error) {
    console.error('Error reading hotel data:', error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      data: {}
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Node started with port ${PORT}`);
});