// Example using Google Maps API
const axios = require('axios');

exports.getDirections = async (origin, destination) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Map service error');
  }
};