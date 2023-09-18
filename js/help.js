const dialogHelp = document.querySelector('.dialog-help');
const buttonHelp = document.querySelector('.button-help');
const buttonCloseHelp = document.querySelector('.button-close-help');

buttonHelp.addEventListener('click', () => {
    dialogHelp.showModal();
    dialogSettings.close();
})

buttonCloseHelp.addEventListener('click', () => {
    dialogHelp.close();
})

dialogHelp.addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();

    const clickedInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
    );

    if (clickedInDialog === false) { dialogHelp.close(); }
});

openSettings.addEventListener('click', () => {
    dialogSettings.showModal();
    dialogHelp.close();
})