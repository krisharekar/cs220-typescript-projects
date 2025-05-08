// Do not directly import these from your files. This allows the autograder to evaluate the functions in this
// file against the sample solution.
import { fetchCurrentTemperature, fetchGeoCoord, fetchUniversities } from "../include/exports.js";

export async function fetchUniversityWeather(universityQuery, transformName) {
  // TODO
  const unis = await fetchUniversities(universityQuery);
  if (unis.length < 1) return Promise.reject(new Error("No results found for query."));
  const result = { totalAverage: 0 }; //init
  let sum = 0;
  for (const uni of unis) {
    const geoCoord = await fetchGeoCoord(transformName ? transformName(uni) : uni);
    const temp = await fetchCurrentTemperature(geoCoord);
    const avgTemp = temp.temperature_2m.reduce((acc, i) => acc + i, 0) / temp.temperature_2m.length;
    result[uni] = avgTemp;
    sum += avgTemp;
  }

  result.totalAverage = sum / unis.length;
  return result;
}

export function fetchUMassWeather() {
  // TODO
  return fetchUniversityWeather("University of Massachusetts", string => string.replaceAll(" at", ""));
}

export function fetchUMichWeather() {
  // TODO
  return fetchUniversityWeather("University of Michigan");
}
