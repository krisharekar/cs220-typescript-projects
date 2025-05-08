import searchURL from "./utility";

export function fetchGeoCoord(query) {
  // TODO
  const url = searchURL("https://220.maxkuechen.com/geoCoord/search", query);
  return fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(`Error in response: ${res.statusText}`))))
    .then(json =>
      Array.isArray(json) && json.length > 0
        ? Promise.resolve({
            lon: Number.parseFloat(json[0].lon),
            lat: Number.parseFloat(json[0].lat),
            importances: json[0].importances,
          })
        : Promise.reject(new Error("No results"))
    );
}

export function locationImportantEnough(place, importanceThreshold) {
  // TODO
  return fetchGeoCoord(place).then(obj => Math.max(0, ...obj.importances) > importanceThreshold);
}
