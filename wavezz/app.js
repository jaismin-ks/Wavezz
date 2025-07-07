/********************************************************************************
 *  BTI225 – Assignment 04
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: ______________________ Student ID: ______________ Date: ______________
 *
 ********************************************************************************/

// All of our data is available on the global `window` object.
// Create local variables to work with it in this file.
const { artists, songs } = window;

const menu = document.getElementById("menu");
const currArtist = document.getElementById("selected-artist");
const songsElem = document.getElementById("songs");

// For debugging, display all of our data in the console. You can remove this later.
console.log({ artists, songs }, "App Data");

function displayInfo(artists, songs) {
  artists.forEach((elem) => {
    console.log(elem);
    const btn = document.createElement("button");
    btn.setAttribute("id", elem.artistID);
    btn.innerText = elem.name;
    menu.appendChild(btn);

    btn.onclick = () => {
      currArtist.innerHTML = elem.name + " (";
      elem.urls.forEach((currUrl, index) => {
        const link = document.createElement("a");
        link.setAttribute("href", currUrl.url);
        link.innerText = currUrl.name;
        link.target = "_blank";

        currArtist.appendChild(link);

        if (index !== elem.urls.length - 1) {
          currArtist.innerHTML += ", ";
        }
      });
      currArtist.innerHTML += ")";

      const currSongs = songs.filter((song) => song.artistId == elem.artistId);
      songsElem.innerHTML = "";
      currSongs.forEach((song) => {
        const row = document.createElement("tr");

        row.onclick = () => {
          console.log(song);
        };

        const songTitle = document.createElement("td");
        const songYear = document.createElement("td");
        const duration = document.createElement("td");

        const link = document.createElement("a");
        link.setAttribute("href", song.url);
        link.target = "_blank";
        link.innerText = song.title;

        songTitle.appendChild(link);

        songYear.innerText = song.year;

        const songMin = Math.floor(song.duration / 60);
        let songSec = song.duration % 60;

        if (songSec < 10) {
          songSec = "0" + songSec;
        }

        duration.innerText = songMin + ":" + songSec;

        row.appendChild(songTitle);
        row.appendChild(songYear);
        row.appendChild(duration);

        songsElem.appendChild(row);
      });
    };
  });
}

displayInfo(artists, songs);
