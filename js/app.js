const cardArtists1 = document.querySelector('.artiste1');
const cardArtists2 = document.querySelector('.artiste2');
const cardArtists3 = document.querySelector('.artiste3');
const cardArtists4 = document.querySelector('.artiste4');

const textPhrase1 = document.querySelector('.phrase1');
const textPhrase2 = document.querySelector('.phrase2');
const textScore = document.querySelector('.nb-score');
const textBest = document.querySelector('.nb-best');

var record = 0;
var artists_names = ["Nekfeu", "Orelsan", "Lomepal", "Damso"];


window.addEventListener("load", function() {
    // check si record dans le local storage
    if (localStorage.getItem("record") != null) {
        record = localStorage.getItem("record");
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
    const cards = document.querySelector(".artistes");

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
    
    score = 0;

    while (true) {
        // Update des scores
        textScore.textContent = score;
        textBest.textContent = record;

        if (score > record) {
            record = score;
            textBest.textContent = record;
            localStorage.setItem("record", record);
        }

        // récupérer une phrase aléatoire
        const randomArtist = Math.floor(Math.random() * artists_names.length);
        const randomLyrics = Math.floor(Math.random() * lyrics[randomArtist].length);
        const randomPhrase = lyrics[randomArtist][randomLyrics];
        console.log(randomPhrase);

        // affichage de la phrase
        textPhrase1.textContent = randomPhrase["ligne1"] + ",";
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

        //check si réussi ou pas
        if (vote == artists_names[randomArtist]) {
            score += 1;
        } 
        else {
            score -= 1;
        }
            
    }
}
