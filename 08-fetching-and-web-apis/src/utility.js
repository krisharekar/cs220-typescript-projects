// Even if you do not use this file, do not delete it. The autograder will fail.
import { URL } from "url";

function makeSearchURL(url, query) {
  // Construct a new URL object using the resource URL
  const searchURL = new URL(url);

  // Access the searchParams field of the constructed url
  // The field holds an instance of the URLSearchParams
  // Add a new "q" parameter with the value of the functions input
  searchURL.searchParams.append("q", query);

  return searchURL.toString(); // Return the resulting complete URL
}

export default makeSearchURL;
