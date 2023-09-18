import lyricsgenius as lrc
from lyricsgenius import Genius
from auth import *
import argparse
import json, re, os

RED = "\x1b[31m"
BLUE = "\x1b[34m"
RESET = "\x1b[0m"

genius = Genius(GENIUS_CLIENT_ACCES_TOKEN)
# genius.verbose = False
# genius.remove_section_headers = True
genius.skip_non_songs = True
genius.excluded_terms = ["Remix", "Live", "Instrumental", "Edit", "Mix", "Acoustic", "Skit", "Freestyle", "Cover", "Session", "Version", "Medley", "Interlude", "Feat", "Featuring"]

def getSongsOfArtists(artist_name, num_songs=10):
    artist = genius.search_artist(artist_name, max_songs=num_songs, sort="popularity")
    return [song for song in artist.songs]


def getLyricsFromArtist(artist_name, num_songs=10):
    songs = getSongsOfArtists(artist_name, num_songs)
    lyrics = []
    for song in songs:
        song_lyrics = song.lyrics.split("\n")
        song_lyrics[-1] = re.sub(r'\d+Embed$', '', song_lyrics[-1])
        cleaned_lyrics = "\n".join(song_lyrics[1:]).strip()
        if cleaned_lyrics != "":
            lyrics.append({
                "titre": song.title.replace("’", "'"),
                "lyrics": cleaned_lyrics.replace("’", "'"),
                "date": song.release_date,
            })
    return lyrics



def main():
    # Ajouter les arguments attendus
    parser = argparse.ArgumentParser()
    parser.add_argument("artist", type=str)
    parser.add_argument("nb_max_song", type=int)
    args = parser.parse_args()
    artist = args.artist
    nb_max_song = args.nb_max_song

    lyrics_path = f"lyrics/{artist.replace(' ', '_')}.json"
    if not os.path.exists(lyrics_path):
        i = 1
        while i < 10:
            i += 1
            try:
                print(f"Getting lyrics from {artist}")
                all_lyrics = getLyricsFromArtist(artist, nb_max_song)
                break
            except Exception as e:
                print(RED + f"Erreur sur {artist} : {e}" + RESET)
                print(RED + f"Redo, essai {i}" + RESET)

        json.dump(all_lyrics, open(lyrics_path, "w", encoding="utf-8"), indent=4, ensure_ascii=False)

        print(f"Got {len(all_lyrics)} lyrics from {artist}")

    else:
        print(f"Lyrics from {artist} already exists")




if __name__ == "__main__":
    main()
