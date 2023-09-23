import subprocess
import sys, os, time

RED = "\x1b[31m"
BLUE = "\x1b[34m"
RESET = "\x1b[0m"


os.system('cls' if os.name == 'nt' else 'clear')
if not os.path.exists("lyrics"):
    os.makedirs("lyrics")

artists = ["Nekfeu", "Orelsan", "Lomepal", "Damso", "Alpha Wann", "Freeze Corleone", "Kaaris", "Booba", "Bigflo & Oli", "Caballero & JeanJass", "Tayc", "Dadju", "Jul", "SCH", "Angèle", "Aya Nakamura", "Laylow", "Jazzy Bazz", "Gringe", "Vald"]
artists += ["Ninho", "Koba LaD", "Hamza", "Gims", "MC Solaar", "Eddy De Pretto", "Roméo Elvis", "Diams", "Lorenzo", "Ziak", "Stromae", "Gazo", "Naza", "PNL"] # Non utilisés
# artists = ["Nekfeu", "Orelsan", "Lomepal", "Damso"]
nb_max_song = 100
full_total_time = time.time()
processes = []

for artist in artists:

        try:
            command = [sys.executable, "back/api.py", str(artist), str(nb_max_song)]
            process = subprocess.Popen(command)
            processes.append(process)

            time.sleep(.1)

        except Exception as e:
             print(RED + f"Erreur sur {artist}" + RESET)

# Attendre que toutes les instances se terminent
for process in processes:
    process.wait()

print("\n\nFiltrage des paroles")

command = [sys.executable, "back/filter.py"]
process = subprocess.Popen(command)
process.wait()

print(BLUE + f"Temps total du programme : {time.time() - full_total_time:.1f}s" + RESET)