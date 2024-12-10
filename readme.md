# POLY-BITSY

Poly-Bitsy is (not) a type of polyphosphate that is used as a food additive.

## Description
Poly-Bitsy est un outil pour [Bitsy](https://www.bitsy.org).

### Un clavier <-> plusieurs bitsies
- Poly-Bitsy permet de jouer à plusieurs Bitsies simultanément avec un seul clavier sur la même page Web. (aka: [Multi-Bitsy](https://switch-b.itch.io/multi-bitsy))

### Un gamepad <-> plusieurs bitsies
- Poly-Bitsy permet de jouer à plusieurs Bitsies simultanément avec un seul gamepad sur la même page Web.

### Plusieurs gamepads <-> un bitsy
- Poly-Bitsy permet de jouer à un Bitsy avec plusieurs gamepads sur la même page Web.

### Plusieurs gamepads <-> plusieurs bitsies
- Poly-Bitsy permet de jouer à plusieurs Bitsies indépendamment avec plusieurs gamepads sur la même page Web.

## Configuration
Le fichier *playlist.json* contient la configuration du Poly-Bitsy.

Il permet de définir des paramètres généraux et la listes des Bitsies jouables.

- L'objet (obligatoire) *settings* definit la taille par défaut en syntaxe css de chaque bitsies.

- L'objet *games* définit la liste des bitsies jouables.
  - Chacun des bitsies est obligatoirement définit par un titre et un lien vers son fichier html ("title" et "path"). 
  - Chacun des bitsies peux contenir différents paramètres individuels et optionnels ("width", "height", "preload", etc.. ).  

- L'objet optionnel "music" définit un fichier mp3 à utiliser comme musique de fond.

### Limitations
Pour avoir accès au gamepads Poly-Bisty a besoin d'être hébergé sur un serveur Web.

> Pour utiliser Poly-Bitsy sur un ordinateur, un serveur Web peut être localement initié depuis le terminal (Linux, MacOs) ou l'invité de commande (Windows) en executant cette commande depuis le dossier racine du Poly-Bitsy :

> ``python3 -m http.server``

> Puis d'aller à l'adresse http://127.0.0.1:8000 pour acceder à la page du Poly-Bitsy.

