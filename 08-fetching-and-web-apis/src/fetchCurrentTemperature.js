export function fetchCurrentTemperature(coords) {
  // TODO
  const searchURL = `https://220.maxkuechen.com/currentTemperature/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m&temperature_unit=fahrenheit`;
  return fetch(searchURL)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      }
      return response.json();
    })
    .then(data => {
      return {
        time: data.hourly.time,
        temperature_2m: data.hourly.temperature_2m,
      };
    });
}

export function tempAvgAboveAtCoords(coords, temp) {
  // TODO
  return fetchCurrentTemperature(coords).then(data => {
    const temperatures = data.temperature_2m;
    const sum = temperatures.reduce((total, current) => total + current, 0);
    const average = sum / temperatures.length;
    return average > temp;
  });
}
