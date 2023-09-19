async function loadAndParseJSON(fichier) {
    try {
        const response = await fetch(fichier);
        const jsonData = await response.json();

        if (Array.isArray(jsonData)) {
            return jsonData;
        } else {
            console.error('Le fichier JSON est incorrect.');
        }
    }
    catch (error) {
        console.error('Une erreur s\'est produite lors du chargement du JSON :', error);
    }
}


async function checkFileExists(url) {
    return await fetch(url)
        .then((response) => {
            if (response.status === 200) { return true; }
            else { return false; }
        })
        .catch(() => { return false; });
}