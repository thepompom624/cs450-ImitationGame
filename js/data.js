/**
 * Loads CSV tables (Papa Parse) and exposes read helpers.
 * Depends on `paths.js` (defines window.CSV_PATHS) and a global `Papa`
 * from papaparse.min.js loaded before this file.
 */

const DATA = {
  movie: [],
  people: [],
  actor: [],
  director: [],
  writer: [],
  actsIn: [],
};
const CSV_PATHS = {
  movie: "assets/csv_files/Movie.csv",
  people: "assets/csv_files/People.csv",
  actor: "assets/csv_files/Actor.csv",
  director: "assets/csv_files/Director.csv",
  writer: "assets/csv_files/Writer.csv",
  actsIn: "assets/csv_files/ActsIn.csv",
};

/**
 * runs for each csv file and will create arrays of objects for us to work with
 * @param {*} path the path of the CSV file to read 
 * @returns an array of our csv files where each record is a key value pair object
 */
async function fetchCsvText(path) {
  // Genertic file reading for javascript
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  const text = await response.text();
  // we use a library to parse the CSV file from raw text to Objects
  const result = window.Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return result.data; // returns the actual data
}

/**
 * helper function called to load all csvs by calling fetchcsvtext on each
 */
async function loadAllCsv() {
  // get our CSV_Paths
  const entries = Object.entries(CSV_PATHS);
  // create an async Promise call that will wait for all CSV files to be processed
  await Promise.all(
    entries.map(async ([key, path]) => {
      DATA[key] = await fetchCsvText(path);
    })
  );
}

// SQL: select * from Movies
function getAllMovies() {
  return DATA.movie.slice();
}

// select * from Movies where movie_id == id
// where id is a given variable
function getMovieById(id) {
  const n = Number(id);
  return DATA.movie.find(
    (m) => Number(m.movie_id) === n || String(m.movie_id) === String(id)
  );
}

/**
 * @param {object[]} movies Row objects from Movie.csv
 * @param {string} sortKey e.g. genre-asc, year-desc, title-desc
 * relevant SQL commands would be
 * select * from Movies ORDER BY ("genre"/"year"/"title") (ASC/DESC)
 */
function sortMovies(movies, sortKey) {
  const rows = [...movies];

  // convert our filters from sortKeys to relevant info like asc/desc and what field
  const lastHyphen = sortKey.lastIndexOf("-");
  const field = sortKey.slice(0, lastHyphen);
  const dirToken = sortKey.slice(lastHyphen + 1);
  const dir = dirToken === "asc" ? 1 : -1;

  // functions to convert from raw data to String/Numbers as needed
  const genreOf = (row) => String(row.genre ?? "");
  const yearOf = (row) => Number(row.Year) || 0;
  const titleOf = (row) => String(row.Title ?? "");

  // now the actual sorting
  // use a function above based on the field we are sorting on
  // strings will need to use localCompare to compare strings in javascript
  rows.sort((a, b) => {
    let cmp = 0;
    if (field === "genre") {
      cmp = genreOf(a).localeCompare(genreOf(b), undefined, { sensitivity: "base" });
    } else if (field === "year") {
      cmp = yearOf(a) - yearOf(b);
    } else if (field === "title") {
      cmp = titleOf(a).localeCompare(titleOf(b), undefined, { sensitivity: "base" });
    }
    // this makes it negative if descending
    return cmp * dir;
  });
  return rows;
}

// SQL: select * from People
function getAllPeople() {
  return DATA.people.slice();
}

function getPersonById(id) {
  const n = Number(id);
  return DATA.people.find((p) => Number(p.person_id) === n);
}

// finds the relevant information for our roles(Actor, Director, Writer)
// SQL: select * from (ACTOR/DIRECTOR/WRITER) NATURAL JOIN People
function peopleInRole(roleTable) {
  const ids = new Set(
    roleTable.map((r) => Number(r.person_id)).filter((n) => !Number.isNaN(n))
  );
  return DATA.people.filter((p) => ids.has(Number(p.person_id)));
}

function getActors() {
  return peopleInRole(DATA.actor);
}

function getDirectors() {
  return peopleInRole(DATA.director);
}

function getWriters() {
  return peopleInRole(DATA.writer);
}

// SQL: select * from ActsIn
function getActsInRows() {
  return DATA.actsIn.slice();
}

/**
 * connects the ACTSIN relationship between Actor and Movie. We use People because it has relevant info like names
 * SQL: select * from Movie NATURAL JOIN Actor NATURAL JOIN People where Movie.movie_id == movieId
 * @param {*} movieId 
 * @returns 
 */
function getCastForMovie(movieId) {
  const mid = Number(movieId);
  const peopleById = new Map(
    DATA.people.map((p) => [Number(p.person_id), p])
  );
  return DATA.actsIn
    .filter((row) => Number(row.movie_id) === mid) //select * from actsIn where movie_id == given mid
    .map((row) => peopleById.get(Number(row.person_id))) //select * from people where person_id IN(ABOVE SUBQUERY)
    .filter(Boolean); // filters for the ones that are truthy aka not null
}

window.dataReady = loadAllCsv() // called on start
  .then(() => {
    console.log("[data] CSV tables loaded", DATA);
  })
  .catch((err) => {
    console.error("[data] Failed to load CSV", err);
    throw err;
  });

Object.assign(window, {
  getAllMovies,
  getMovieById,
  sortMovies,
  getAllPeople,
  getPersonById,
  getActors,
  getDirectors,
  getWriters,
  getActsInRows,
  getCastForMovie,
});
