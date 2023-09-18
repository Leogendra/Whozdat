const dialogSettings = document.querySelector('.dialog-settings');
const buttonSettings = document.querySelector('.button-settings');
const buttonCloseSettings = document.querySelector('.button-close-settings');

const openSettings = document.querySelector('.open-settings');

buttonSettings.addEventListener('click', () => {
    dialogSettings.showModal();
    dialogHelp.close();
})

buttonCloseSettings.addEventListener('click', () => {
    dialogSettings.close();
})

dialogSettings.addEventListener('click', (e) => {
    if (e.target.tagName !== 'DIALOG') {
        return;
    }

    const rect = e.target.getBoundingClientRect();

    const clickedInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
    );

    if (clickedInDialog === false) { dialogSettings.close(); }
});



const all_artists = ["Nekfeu", "Orelsan", "Lomepal", "Damso", "Bigflo & Oli", "SCH", "Ninho", "Booba", "Kaaris", "Aya Nakamura", "Angèle", "Vald", "Koba LaD", "Hamza", "Jul", "Gims", "MC Solaar", "Eddy De Pretto", "Rohff", "Kery James"]
const divArtists = document.querySelector('.settings-artists');

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



const checkboxElements = document.querySelectorAll('.choice-artist');

divArtists.addEventListener('click', function (event) {
    const selectedElements = document.querySelectorAll('.choice-artist:checked');
    const selectionCount = selectedElements.length;

    // Si < 3 checkbox cochées, les disable
    if (selectionCount <= 3) {
        checkboxElements.forEach(element => {
            if (element.checked) {
                element.disabled = true;
            }
            else {
                element.disabled = false;
            }
        });
    }
    // Si > 4 checkbox cochées, décochez la première ou la dernière checkbox cochée
    else if (selectionCount > 4) {
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
    // Tout décocher
    else {
        checkboxElements.forEach(element => {
            element.disabled = false;
        });
    }
});

const buttonValidate = document.querySelector('.settings-text-save');
const messageErreur = document.querySelector('.message-erreur');

buttonValidate.addEventListener('click', function () {

    const selectedElements = document.querySelectorAll('.choice-artist:checked');
    const selectionCount = selectedElements.length;

    if (selectionCount === 3 || selectionCount === 4) {
        messageErreur.textContent = "";

        artists_names = [];
        selectedElements.forEach(element => {
            artists_names.push(element.id.replace('-', ' '));
        });

        console.log(artists_names);
        dialogSettings.close();
    }
    else {
        messageErreur.textContent = "Veuillez sélectionner 3 ou 4 artistes";
    }
});