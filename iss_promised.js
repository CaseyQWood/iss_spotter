const request = require('request-promise-native')

  const fetchMyIp = (callback) => {
    return request('https://api.ipify.org/?format=json')
  };
  const fetchCoordsByIp = (body) => {
    const ip = JSON.parse(body).ip;
    return request(`https://freegeoip.app/json/${ip}`)
  }
  const fetchISSFlyOverTimes = (coords) => {
    const long = JSON.parse(coords).longitude
    const lat = JSON.parse(coords).latitude
    return request(`http://api.open-notify.org/iss/v1/?lat=${lat}&lon=${long}`)
  }


const nextISSTimesForMyLocation = () => {
  return fetchMyIp()
    .then(fetchCoordsByIp)
    .then(fetchISSFlyOverTimes)
    .then((location) => {
      const {response} = JSON.parse(location)
      return response
    })
  }



module.exports = {

  nextISSTimesForMyLocation,

};