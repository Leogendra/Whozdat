from collections import Counter
import re, os
import json
import math



def similarities(phrase1, phrase2):

    def wordsOfSentence(phrase):
        mots = re.findall(r'\w+', phrase)
        return Counter(mots)

    compteur_phrase1 = wordsOfSentence(phrase1)
    compteur_phrase2 = wordsOfSentence(phrase2)

    ensemble_mots = set(compteur_phrase1) | set(compteur_phrase2)
    produit_scalaire = sum(compteur_phrase1.get(mot, 0) * compteur_phrase2.get(mot, 0) for mot in ensemble_mots)

    norme_phrase1 = math.sqrt(sum(compteur_phrase1[mot] ** 2 for mot in ensemble_mots))
    norme_phrase2 = math.sqrt(sum(compteur_phrase2[mot] ** 2 for mot in ensemble_mots))

    similarite_cosinus = produit_scalaire / (norme_phrase1 * norme_phrase2)

    return similarite_cosinus


def cleanText(line):
    while '(' in line and ')' in line:
        debut_parenthese = line.index('(')
        fin_parenthese = line.index(')')
        line = line[:debut_parenthese] + line[fin_parenthese + 1:]

    line = line.replace("You might also like", "")
    line = line.replace("Embed", "")
    return line.strip()


def getParagraphes(texte):
    paragraphes = []
    nom_du_paragraphe = None
    lines_du_paragraphe = []
    lines = texte.strip().split('\n')

    for line in lines:
        line = cleanText(line)
        if line.startswith("[") and line.endswith("]"):
            if nom_du_paragraphe is not None:
                paragraphes.append((nom_du_paragraphe, lines_du_paragraphe))

            nom_du_paragraphe = line.strip("[]")
            lines_du_paragraphe = []
        elif line == "":
            continue
        else:
            lines_du_paragraphe.append(line)

    # Enregistre le dernier paragraphe
    if nom_du_paragraphe is not None:
        paragraphes.append((nom_du_paragraphe, lines_du_paragraphe))

    return paragraphes





def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    if not os.path.exists("data"):
        os.makedirs("data")
    

    for filename in os.listdir("lyrics"):
        artiste = json.load(open(f"lyrics/{filename}", "r", encoding="utf-8"))
        artiste_name = filename.replace(".json", "").replace("_", " ")
        print(f"\nAnalyse de {artiste_name}")

        rimes = []
        for i, song in enumerate(artiste):
            titre = song["titre"]
            texte = song["lyrics"]
            date = song["date"]
            print(f"Titre {i+1}/{len(artiste)}", end="\r")
            paragraphes = getParagraphes(texte)

            for section_header, lignes in paragraphes:
                if len(lignes) % 2:
                    continue
                
                for i in range(0, len(lignes), 2):
                    ligne1 = lignes[i]
                    ligne2 = lignes[i+1]

                    if "refrain" in section_header.lower():
                        continue

                    if ":" in section_header:
                        if section_header.split(":")[1].strip().lower() != artiste_name.lower():
                            continue

                    if ("..." in ligne1) or ("..." in ligne2):
                        continue
                    
                    if (len(ligne1) > 70) or (len(ligne2) > 70):
                        continue

                    if (len(ligne1.split(" ")) < 5) or (len(ligne2.split(" ")) < 5):
                        continue

                    if (len(ligne1.split(" ")) > 15) or (len(ligne2.split(" ")) > 15):
                        continue

                    if similarities(ligne1, ligne2) > 0.5:
                        continue

                    rimes.append({
                        "artiste": artiste_name,
                        "titre": titre,
                        "date": date,
                        "couplet": section_header,
                        "ligne1": ligne1, 
                        "ligne2": ligne2
                    })

            
        json.dump(rimes, open(f"data/{artiste_name}.json", "w", encoding="utf-8"), indent=4, ensure_ascii=False)

        print(f"\n{len(rimes)} rimes pour {artiste_name} trouvées")




if __name__ == "__main__":
    main()