const dialogSettings = document.querySelector('.dialog-settings');
const buttonSettings = document.querySelector('.button-settings');
const buttonCloseSettings = document.querySelector('.button-close-settings');
const openSettings = document.querySelector('.open-settings');

const divArtists = document.querySelector('.settings-artists');
const divModes = document.querySelector('.settings-modes');

const buttonValidate = document.querySelector('.settings-text-save');
const messageErreur = document.querySelector('.message-erreur');

var checkboxElements = document.querySelectorAll('.choice-artist');
var all_artists = ["Nekfeu", "Orelsan", "Lomepal", "Damso"] // Projet NOLD Original
all_artists = all_artists.concat(["Alpha Wann", "Freeze Corleone"]); // Rap Catéchisme Update
all_artists = all_artists.concat(["Kaaris", "Booba"]); // Bagarre Update
all_artists = all_artists.concat(["Bigflo & Oli", "Caballero & JeanJass"]); // Duo Update
all_artists = all_artists.concat(["Tayc", "Dadju"]); // Lover Update
all_artists = all_artists.concat(["Jul", "SCH"]); // Marseille Update
all_artists = all_artists.concat(["Angèle", "Aya Nakamura"]); // Chanteuses Update
all_artists = all_artists.concat(["Laylow", "Jazzy Bazz"]); // New Wave Update
all_artists = all_artists.concat(["Gringe", "Vald"]); // "Qui Dit Mieux" Update


buttonSettings.addEventListener('click', () => {
    dialogSettings.showModal();
    dialogHelp.close();
})

buttonCloseSettings.addEventListener('click', () => {
    dialogSettings.close();
})

dialogSettings.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIALOG') {
        const rect = e.target.getBoundingClientRect();
        const clickedInDialog = (
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
        );
        if (clickedInDialog === false) { dialogSettings.close(); }
    }
});

async function saveSettings() {
    const settings = {
        artists_names: artists_names,
        speed: speed,
        mode: mode
    };
    localStorage.setItem('settings', JSON.stringify(settings));
}



/********** Mise à jour des checkbox avec les noms d'artistes **********/
async function updateCheckboxes() {
    divArtists.innerHTML = "";
    all_artists.forEach(artist => {
        const input = document.createElement('input');
        const artistShort = artist.replace(' ', '-');
        input.type = 'checkbox';
        if (artists_names.includes(artist)) {
            input.checked = true;
        }
        input.id = artistShort;
        input.classList.add('choice-artist');

        const label = document.createElement('label');
        label.htmlFor = artistShort;
        label.textContent = artist;

        const wrapper = document.createElement('div');
        wrapper.classList.add('grid-cell');

        wrapper.appendChild(input);
        wrapper.appendChild(label);

        divArtists.appendChild(wrapper);
    });
    checkboxElements = document.querySelectorAll('.choice-artist');
}


/********** Speed mode **********/
buttonSpeedMode.addEventListener("click", async (e) => {
    speed = speedCheckbox.checked;
});


/********** Changement de mode **********/
divModes.addEventListener('click', function (event) {

    if (event.target.tagName.toLowerCase() == 'input') {
        let input = event.target;
        let slider = this.querySelector('.div-slider');
        let labels = this.querySelectorAll('label');

        slider.style.transform = `translateX(${input.dataset.location})`;
        labels.forEach(function (label) {
            if (label == input.parentElement) {
                label.classList.add('selected');
            }
            else {
                label.classList.remove('selected');
            }
        });

    }
    else if (event.target.tagName.toLowerCase() == 'div')  {
        mode = event.target.textContent.toLowerCase();
    }
});


/********** Gestion des checkbox des artists **********/
divArtists.addEventListener('click', function (event) {
    const selectedElements = document.querySelectorAll('.choice-artist:checked');
    const selectionCount = selectedElements.length;
    messageErreur.textContent = "";

    // Si > 4 checkbox cochées, décochez la première ou la dernière checkbox cochée
    if (selectionCount > 4) {
        const newlyCheckedElement = event.target;
        let numNewElement = -1;

        for (let i = 0; i < selectedElements.length; i++) {
            const element = selectedElements[i];
            if (element === newlyCheckedElement) {
                numNewElement = i;
            }
        }
        if ((numNewElement === 3) || (numNewElement === 4)) {
            selectedElements[0].checked = false;
        }
        else {
            selectedElements[selectionCount - 1].checked = false;
        }
    }

    else {
        checkboxElements.forEach(element => {
            element.disabled = false;
        });
    }
});


/********** Bouton de validation **********/
buttonValidate.addEventListener('click', function () {

    const selectedElements = document.querySelectorAll('.choice-artist:checked');
    const selectionCount = selectedElements.length;

    if (selectionCount === 2 || selectionCount === 3 || selectionCount === 4) {
        messageErreur.textContent = "";

        artists_names = [];
        selectedElements.forEach(element => {
            artists_names.push(element.id.replace('-', ' '));
        });
        saveSettings();
        dialogSettings.close();
        location.reload();
    }
    else {
        messageErreur.textContent = "Veuillez sélectionner 2, 3 ou 4 artistes";
    }
});