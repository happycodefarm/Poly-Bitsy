# POLY-BITSY


## Déscription
Poly-Bitsy est un outil de pésentation pour [Bitsy](https://www.bitsy.org) permettant à la fois de créer des playlists de Bitsies et de contrôler plusieurs Bitsies simultanement ou indépendament au clavier ou avec un ou plusieurs gamepads sur une page Web.

### Un gamepad <-> un bitsy
- Poly-Bitsy permet de jouer un Bitsy avec un gamepad à la place du clavier.

### Un clavier <-> plusieurs bitsies
- Poly-Bitsy permet de jouer à plusieurs Bitsies simultanément avec un seul clavier sur la même page Web. (aka: [Multi-Bitsy](https://switch-b.itch.io/multi-bitsy))

### Un gamepad <-> plusieurs bitsies
- Poly-Bitsy permet de jouer à plusieurs Bitsies simultanément avec un seul gamepad sur la même page Web.

### Plusieurs gamepads <-> un bitsy
- Poly-Bitsy permet de jouer au même Bitsy avec plusieurs gamepads sur la même page Web.

### Plusieurs gamepads <-> plusieurs bitsies
- Poly-Bitsy permet de jouer à plusieurs Bitsies indépendamment avec plusieurs gamepads sur la même page Web.

### Plusieurs gamepads <-> plusieurs bitsies <-> plusieurs pages Web
- Toutes les options de contrôle par gamepad citées ci-dessus fonctionnent aussi avec plusieurs Poly-Bitsy tournant sur des pages Web séparées.

## Configuration
Le fichier *playlist.json* contient la configuration du Poly-Bitsy.

Il permet de définir des paramètres généraux et la listes des Bitsies jouables.

- L'objet (obligatoire) *settings* definit la taille par défaut en syntaxe css de chaque bitsies.

- L'objet *games* définit la liste des Bitsies jouables.
  - Chacun des Bitsies est obligatoirement définit par un titre et un lien vers son fichier html ("title" et "path"). 
  - Chacun des bitsies peux contenir différents paramètres individuels et optionnels ("width", "height", "preload", etc.. ).  

- L'objet optionnel "music" définit un fichier mp3 à utiliser comme musique de fond.

### Limitations
- Pour l'instant Poly-Bitsy ne fonctionne que sur Firefox avec les gampads.

- Pour avoir accès aux gamepads Poly-Bisty a besoin d'être hébergé sur un serveur Web.

> Pour utiliser Poly-Bitsy sur un ordinateur, un serveur Web peut être localement initié depuis le terminal (Linux, MacOs) ou l'invité de commande (Windows) en exécutant cette commande depuis le dossier racine du Poly-Bitsy :

> ``python3 -m http.server``

> Puis d'aller à l'adresse http://127.0.0.1:8000 pour accéder à la page du Poly-Bitsy.

> D'autres techniques sont possibles: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/set_up_a_local_testing_server

### Démo en ligne
https://happycodefarm.github.io/Poly-Bitsy/
