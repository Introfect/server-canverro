// geocode.js

const axios = require('axios');
const opencage = require('opencage-api-client')

// Replace 'YOUR_API_KEY' with your actual API key for the OpenCage Geocoding API

async function geocode(latitude, longitude) {
  try {
    opencage
    .geocode({ q: `${latitude}, ${longitude}`, language: 'fr' })
    .then((data) => {
      // console.log(JSON.stringify(data));
      if (data.status.code === 200 && data.results.length > 0) {
        const place = data.results[0];
        console.log(place.formatted);
        console.log(place.components.road);
        console.log(place.annotations.timezone.name);
        return({
            "place":place.formatted.road
        })
      } else {
        console.log('status', data.status.message);
        console.log('total_results', data.total_results);
      }
    })
    .catch((error) => {
      console.log('error', error.message);
      if (error.status.code === 402) {
        console.log('hit free trial daily limit');
        console.log('become a customer: https://opencagedata.com/pricing');
      }
    });
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    throw error;
  }
}



module.exports = geocode;
