// Working Example

// Description:
// Takes in user input for song name, fetches top 5 results and displays the song title, artist name and album name, any of which could contain the input.
// Asks user for another input (title number from 1 - 5) for which song out of the results they want the lyrics for.
// Fetches lyrics from another API and displays it.

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import makeSearchURL from "./utility.js";

const rl = readline.createInterface({ input, output });

try {
  const songName = await rl.question("Enter a song name: ");

  const baseURL = "https://api.deezer.com/search";
  const searchURL = makeSearchURL(baseURL, songName);

  const result = await fetch(searchURL).then(res =>
    res.ok ? res.json() : Promise.reject(new Error(`Error: ${res.statusText}`))
  );
  if (!result.data || result.data.length < 1) throw new Error("No results found.");
  const songs = result.data.slice(0, 5).map(x => ({ title: x.title, artist: x.artist.name, album: x.album.title }));

  console.log(`Top ${songs.length} results:`);
  songs.forEach((x, i) => console.log(`\n${i + 1}. Title: `, x.title, "\nArtist: ", x.artist, "\nAlbum: ", x.album));

  const index = Number.parseInt(await rl.question("Enter the title number you want the lyrics for: "));

  if (Number.isNaN(index) || index < 1 || index > songs.length) throw new Error("Invalid title number.");

  const selection = songs[index - 1];

  const lyricsResult = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(selection.artist)}/${encodeURIComponent(selection.title)}`
  ).then(res => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))));
  lyricsResult.lyrics ? console.log("Lyrics:\n\n", lyricsResult.lyrics) : console.log("No lyrics found.");
} catch (err) {
  console.log(`Error: ${err.message}`);
} finally {
  rl.close();
}
