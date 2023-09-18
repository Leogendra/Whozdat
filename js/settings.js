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
    const artistShort = artist.replace(/ /g, '-').toLowerCase();
    input.type = 'checkbox';
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



const selectionElements = document.querySelectorAll('.choice-artist');

divArtists.addEventListener('click', function () {
    const selectedElements = document.querySelectorAll('.choice-artist:checked');
    // Si l'utilisateur sélectionne moins de 3 éléments, désactivez les autres
    if (selectedElements.length === 3) {
        selectionElements.forEach(element => {
            if (element.checked) { element.disabled = true; }
            else { element.disabled = false; }
        });
    }
    else {
        selectionElements.forEach(element => {
            if (!element.checked) { element.disabled = true; }
        });
    }
});
