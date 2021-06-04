// It will contain most of the logic for fetching the data from each API endpoint.
const request = require('request');


const nextISSTimesForMyLocation = (callback) => {
  fetchMyIp((error, ip) => {
    fetchCoordsByIp(ip, (coords, error) => {
      fetchISSFlyOverTimes(coords, (iss) => {
        callback(iss, error);
      });
    });
  });
};

const fetchMyIp = (callback) => {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {return callback(error, null)}

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
    return ip;
  });
};

const fetchCoordsByIp = (ip, callback) => {
  // console.log('this is the ip', ip)
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {return callback(null, error)}

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const location = JSON.parse(body);
    callback({latitude: location.latitude, longitude: location.longitude}, null);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(null, error);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const objCords = JSON.parse(body);
    callback(objCords.response);
  });
};


module.exports = {
  nextISSTimesForMyLocation,
  fetchMyIp,
  fetchISSFlyOverTimes,
  fetchCoordsByIp
};