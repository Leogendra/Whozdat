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

var score = 0;
var streak = 0;
var recordScore = 0;
var recordStreak = 0;
var artists_names = ["Nekfeu", "Orelsan", "Lomepal", "Damso"];


window.addEventListener("load", function () {

    // if (localStorage.getItem("last-score") != null) {
    //     score = localStorage.getItem("last-score");
    // }
    // if (localStorage.getItem("last-streak") != null) {
    //     streak = localStorage.getItem("last-streak");
    // }

    if (localStorage.getItem("record-score") != null) {
        recordScore = localStorage.getItem("record-score");
    }
    if (localStorage.getItem("record-streak") != null) {
        recordStreak = localStorage.getItem("record-streak");
    }

    play();
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

        cardArtist.textContent = artistName;
        cardSong.textContent = "";
        cardImgLong.src = `img/${artistName}-long.png`;
        // cardImgWide.src = `img/${artistName}-wide.png`;
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
                    resolve(btn.querySelector('.card-artist').textContent);
                });
            });
        });
        const vote = await votePromise;

        win = (vote == artists_names[randomArtist]);

        //check si réussi ou pas
        if (win) {
            score += 1;
            if (streak > 0) { streak += 1; }
            else { streak = 1; }
        }
        else {
            score -= 1;
            if (streak < 0) { streak -= 1; }
            else { streak = -1; }
        }

    }
}
