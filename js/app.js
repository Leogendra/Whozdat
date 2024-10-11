const cardArtists1 = document.querySelector('.artiste1');
const cardArtists2 = document.querySelector('.artiste2');
const cardArtists3 = document.querySelector('.artiste3');
const cardArtists4 = document.querySelector('.artiste4');

const textPhrase1 = document.querySelector('.phrase1');
const textPhrase2 = document.querySelector('.phrase2');

const textScore = document.querySelector('.nb-score');
const textStreak = document.querySelector('.nb-streak');
const textBestScore = document.querySelector('.nb-best-score');
const textBestStreak = document.querySelector('.nb-best-streak');

const buttonSpeedMode = document.querySelector('.speed-mode');
const speedCheckbox = document.querySelector('.slide');

const SliderMode = document.querySelector('.div-slider');
const radio_mode = document.querySelectorAll('input[type="radio"]');

const buttonMode = document.querySelector('.settings-modes');

var score = 0;
var streak = 0;
var recordScore = 0;
var recordStreak = 0;
var artists_names = ["Nekfeu", "Orelsan", "Lomepal", "Damso"];
var lyrics = [];

var speed = false;
var mode = "normal";


/********** Utils **********/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function max(a, b) {
    if (a > b) { return a; }
    else { return b; }
}



window.addEventListener("load", function () {

    if (localStorage.getItem("last-score") != null) {
        // convertir en int
        score = parseInt(localStorage.getItem("last-score"));
    }
    if (localStorage.getItem("last-streak") != null) {
        streak = parseInt(localStorage.getItem("last-streak"));
    }

    if (localStorage.getItem("record-score") != null) {
        recordScore = localStorage.getItem("record-score");
        textBestScore.textContent = recordScore;
    }
    if (localStorage.getItem("record-streak") != null) {
        recordStreak = localStorage.getItem("record-streak");
        textBestStreak.textContent = recordStreak;
    }

    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings != null) {
        artists_names = settings.artists_names;
        speed = settings.speed;
        mode = settings.mode;
        speedCheckbox.checked = speed;
    }
    radio_mode.forEach(input => {
        if (input.value === mode) {
            SliderMode.style.transform = `translateX(${input.dataset.location})`;
            input.checked = true;
        }
    });

    updateCheckboxes();
    play();
});


async function updateLyrics() {
    let toKeep = [0, 1]
    if (mode == "facile") { toKeep = [0, 0.3] }
    if (mode == "normal") { toKeep = [0.1, 0.6] }
    if (mode == "difficile") { toKeep = [0.6, 1] }

    lyrics = [];
    for (const artist of artists_names) {
        const artistData = await getArtistLyrics(artist);
        let artistDataFiltered = artistData.slice(Math.ceil(toKeep[0] * artistData.length), Math.ceil(toKeep[1] * artistData.length));
        lyrics.push(artistDataFiltered);
    }
}


/***************** FONCTIONS DE CHARGEMENT *****************/

async function getArtistLyrics(artistName) {
    try {
        const artistData = await loadAndParseJSON(`../data/${artistName}.json`);
        return artistData;
    }
    catch (error) {
        throw new Error('Une erreur s\'est produite lors de la récupération des données d\'artiste :' + error.message);
    }
}



// Mise à jour de l'affichage des cartes
async function updateCardWithArtistsInfo() {
    const cards = document.querySelector(".cards");

    for (let i = 0; i < cards.children.length; i++) {
        const card = cards.children[i];
        const artistName = artists_names[i];

        const cardImgLong = card.querySelector('.card-img-long');
        const cardImgWide = card.querySelector('.card-img-wide');
        const cardArtist = card.querySelector('.card-artist');

        cardArtist.textContent = artistName;

        const imgLongPath = `img/${artistName}-long.png`;
        const imgLongExists = await checkFileExists(imgLongPath);
        if (imgLongExists) { cardImgLong.src = imgLongPath; }
        else { cardImgLong.src = "img/blank-long.png"; }

        const imgWidePath = `img/${artistName}-wide.png`;
        const imgWideExists = await checkFileExists(imgWidePath);
        if (imgWideExists) { cardImgWide.src = imgWidePath; }
        else { cardImgWide.src = "img/blank-wide.png"; }
    }

    if (artists_names.length == 3) { 
        cardArtists4.classList.add("card-hidden"); 
    }
    else if (artists_names.length == 2) { 
        cardArtists4.classList.add("card-hidden"); 
        cardArtists3.classList.add("card-hidden");
    }
    else { 
        cardArtists4.classList.remove("card-hidden"); 
        cardArtists3.classList.remove("card-hidden");
    }
}


async function revealSong(artistIndex, lyrics, vote) {
    const cards = document.querySelector(".cards");
    const result = document.querySelector(".result");
    const resultSong = document.querySelector('.result-song');
    const resultDate = document.querySelector('.result-date');

    result.classList.add("reveal-song");

    result.href = lyrics["url"];

    if (lyrics["date"]) {
        resultDate.innerHTML = "&nbsp; - &nbsp;" + lyrics["date"].split('-')[0];
    }

    if (lyrics["titre"] != lyrics["titre"].substring(0, 30)) {
        resultSong.textContent = lyrics["titre"].substring(0, 27) + "...";
    }
    else {
        resultSong.textContent = lyrics["titre"];
    }

    for (let i = 0; i < cards.children.length; i++) {
        const card = cards.children[i];
        if (i == artistIndex) {
            card.classList.add("card-win");
        }
        else {
            if (vote == i) { card.classList.add("card-lose"); }
            else { card.classList.add("card-neutral"); }
        }
    }
}


function clearCards() {
    const cards = document.querySelector(".cards");
    const result = document.querySelector(".result");
    const resultSong = document.querySelector('.result-song');
    const resultDate = document.querySelector('.result-date');

    result.classList.remove("reveal-song");

    for (let i = 0; i < cards.children.length; i++) {
        const card = cards.children[i];
        resultSong.innerHTML = `<span class="material-symbols-outlined">undo</span>`;
        resultDate.textContent = " ";

        card.classList.remove("card-win");
        card.classList.remove("card-lose");
        card.classList.remove("card-neutral");
    }
}




/***************** FONCTION DE JEU *****************/

async function play() {
    await updateCardWithArtistsInfo();
    await updateLyrics();

    while (true) {

        clearCards();

        // récupérer une phrase aléatoire et retirer l'élément du tableau
        const randomArtistNumber = Math.floor(Math.random() * artists_names.length);
        if (lyrics[randomArtistNumber].length == 0) { 
            lyrics[randomArtistNumber] = await getArtistLyrics(artists_names[randomArtistNumber]); // reremplir le tableau
        }
        const randomLyricsNumber = Math.floor(Math.random() * lyrics[randomArtistNumber].length);
        const randomPhrase = lyrics[randomArtistNumber].splice(randomLyricsNumber, 1)[0]; // on retire l'élément du tableau

        // affichage de la phrase
        textPhrase1.textContent = randomPhrase["ligne1"];
        textPhrase2.textContent = randomPhrase["ligne2"];

        // attend que l'utilisateur clique sur l'un des deux boutons de vote
        const artistCards = document.querySelectorAll('.card');
        const votePromise = new Promise(resolve => {
            artistCards.forEach(btn => {
                btn.addEventListener('click', () => {
                    resolve(btn.dataset.vote);
                });
            });
        });
        const vote = await votePromise;

        //check si réussi ou pas
        revealSong(randomArtistNumber, randomPhrase, vote);

        if (vote == randomArtistNumber) {
            score += 1;
            if (streak > 0) { streak += 1; }
            else { streak = 1; }
        }
        else {
            score = max(0, score - 1)
            if (streak < 0) { streak -= 1; }
            else { streak = -1; }
        }

        if (score > recordScore) {
            recordScore = score;
            textBestScore.textContent = recordScore;
            localStorage.setItem("record-score", recordScore);
        }
        if (streak > recordStreak) {
            recordStreak = score;
            textBestStreak.textContent = recordStreak;
            localStorage.setItem("record-streak", recordStreak);
        }

        textScore.textContent = score;
        textStreak.textContent = streak;

        localStorage.setItem("last-score", score);
        localStorage.setItem("last-streak", streak);


        if (speed) { await delay(1500); }
        else { await delay(3000); }

    }
}