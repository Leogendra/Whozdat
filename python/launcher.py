import subprocess
import sys, os, time

RED = "\x1b[31m"
BLUE = "\x1b[34m"
RESET = "\x1b[0m"


os.system('cls' if os.name == 'nt' else 'clear')
if not os.path.exists("lyrics"):
    os.makedirs("lyrics")

artists = ["Nekfeu", "Orelsan", "Lomepal", "Damso", "Bigflo & Oli", "SCH", "Ninho", "Booba", "Kaaris", "Aya Nakamura", "Angèle", "Vald", "Koba LaD", "Hamza", "Jul", "Gims", "MC Solaar", "Eddy De Pretto", "Roméo Elvis", "Diams", "Gringe", "Alpha Wann", "Freeze Corleone", "Lorenzo"]
# artists = ["Orelsan"]
# artists = ["Nekfeu", "Orelsan", "Lomepal", "Damso"]
nb_max_song = 100
full_total_time = time.time()
processes = []

for artist in artists:

        try:
            command = [sys.executable, "python/api.py", str(artist), str(nb_max_song)]
            process = subprocess.Popen(command)
            processes.append(process)

            time.sleep(.1)

        except Exception as e:
             print(RED + f"Erreur sur {artist}" + RESET)

# Attendre que toutes les instances se terminent
for process in processes:
    process.wait()

print(BLUE + f"Temps total du programme : {time.time() - full_total_time:.1f}s" + RESET)