export function fetchUniversities(query) {
  // TODO
  // Fetches universities from the API based on the provided query.
  // Returns a promise that resolves to an array of university names.
  // If the response is not an array, it returns an empty array.
  // If the response is not ok, it throws an error with the status text.
  const url = `https://220.maxkuechen.com/universities/search?name=${encodeURIComponent(query)}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return Array.isArray(data) ? data.map(univ => univ.name) : [];
    });
}

export function universityNameLengthOrderAscending(queryName) {
  // TODO
  // Fetches universities based on the provided query name and checks if their names are in ascending order by length.
  // Returns a promise that resolves to true if the names are in ascending order, false otherwise.
  // If the response is not an array, it returns false.
  return fetchUniversities(queryName).then(universities => {
    for (let i = 1; i < universities.length; i++) {
      if (universities[i - 1].length >= universities[i].length) {
        return false;
      }
    }
    return true;
  });
}
