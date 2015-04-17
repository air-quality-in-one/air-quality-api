var CityManager = require('../../controllers/city_manager'),
  AirQualityManager = require('../../controllers/air_quality_manager');

module.exports = {
  '/v1/cities': {
    get: CityManager.findAllCities
  },
  '/v1/cities/:city': {
    get: CityManager.findQuality
  },
  '/v1/cities/:city/aqis/:date': {
    get: AirQualityManager.findAQIHistory
  },
  '/v1/rank': {
    get: AirQualityManager.findQualityForAllCities
  }
}