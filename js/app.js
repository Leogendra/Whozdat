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

var speed = false;
var score = 0;
var streak = 0;
var recordScore = 0;
var recordStreak = 0;
var artists_names = ["Nekfeu", "Orelsan", "Lomepal", "Damso"];


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function max(a, b) {
    if (a > b) { return a; }
    else { return b; }
}

window.addEventListener("load", function () {

    // if (localStorage.getItem("last-score") != null) {
    //     score = localStorage.getItem("last-score");
    // }
    // if (localStorage.getItem("last-streak") != null) {
    //     streak = localStorage.getItem("last-streak");
    // }

    if (localStorage.getItem("record-score") != null) {
        recordScore = localStorage.getItem("record-score");
        textBestScore.textContent = recordScore;
    }
    if (localStorage.getItem("record-streak") != null) {
        recordStreak = localStorage.getItem("record-streak");
        textBestStreak.textContent = recordStreak;
    }

    play();
});



// Paramètres

// Speed mode
buttonSpeedMode.addEventListener("click", async (e) => {
    console.log(e);
    if (speed) {
        speed = false;
    }
    else {
        speed = true;
    }
    console.log(speed);
});


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
        const cardSong = card.querySelector('.card-song');
        const cardDate = card.querySelector('.card-date');

        cardArtist.textContent = artistName;
        cardSong.textContent = "";
        cardDate.textContent = "";
        cardImgLong.src = `img/${artistName}-long.png`;
        // cardImgWide.src = `img/${artistName}-wide.png`;
    }
}


async function revealSong(artistIndex, lyrics, vote) {
    const cards = document.querySelector(".cards");
    const result = document.querySelector(".result");
    const resultSong = document.querySelector('.result-song');
    const resultDate = document.querySelector('.result-date');

    result.classList.add("reveal-song");

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
        resultSong.innerHTML = "&nbsp;";
        resultDate.textContent = " ";

        card.classList.remove("card-win");
        card.classList.remove("card-lose");
        card.classList.remove("card-neutral");
    }
}




/***************** FONCTION DE JEU *****************/

async function play() {
    updateCardWithArtistsInfo();

    var lyrics = []
    for (const artist of artists_names) {
        const artistData = await getArtistLyrics(artist);
        lyrics.push(artistData);
    }

    let win = true;

    while (true) {

        clearCards();

        // récupérer une phrase aléatoire
        const randomArtist = Math.floor(Math.random() * artists_names.length);
        const randomLyrics = Math.floor(Math.random() * lyrics[randomArtist].length);
        const randomPhrase = lyrics[randomArtist][randomLyrics];
        console.log(randomPhrase);

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
        revealSong(randomArtist, randomPhrase, vote);

        if (vote == randomArtist) {
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


        // if (speed) { await delay(1500); }
        // else { await delay(3000); }
        await delay(1000);

    }
}