# Valcendre : l'horloge aux énigmes

Un jeu d'énigmes illustrées avec une histoire. Cette nuit, la grande horloge de Valcendre s'est arrêtée. Ses 192 rouages ont roulé dans toute la ville, et chaque habitant ne rend le sien qu'à qui résout son énigme.

*English version: [README.en.md](README.en.md)*

## La ville

Huit quartiers, chacun avec son habitant :

- le Marché et Mme Brindille, la boulangère ;
- le Port et Octave, le passeur ;
- la Tour de l'Horloge et Ysé, l'archiviste ;
- les Jardins suspendus et Capucine, la jardinière ;
- les Thermes et Hector, le maître des bains ;
- les Mines de cuivre et Gaspard, le mineur ;
- le Théâtre des automates et Madame Lyre ;
- l'Observatoire et Sélène, l'astronome.

Le premier quartier est ouvert ; **résoudre 7 énigmes** d'un quartier ouvre le suivant. Tu choisis librement l'ordre des énigmes dans un quartier.

## Les énigmes

192 énigmes, chacune avec son illustration, d'une vingtaine de genres :

- **à manipuler** : allumettes à déplacer, passeurs et rivière, vases à verser, tuyaux à tourner, labyrinthes à clés, tours de Hanoï, taquins, grenouilles qui se croisent, tracés d'un seul trait ;
- **de logique** : pièces qui ne se menacent pas, cartes à colorier, carrés latins, images à révéler (picross), dessins à compléter en miroir ;
- **de déduction** : files et rangées à remettre en ordre, cadenas à code, menteurs et coffres ;
- **de calcul, d'observation et des devinettes**, avec une horloge à régler.

Selon l'énigme, tu tapes un nombre ou un mot, tu choisis parmi des réponses, ou tu manipules directement le dessin (déplacer, tourner, verser, colorier).

## Étincelles et bougies

- Chaque énigme vaut des **étincelles**, indiquées sur sa carte. Chaque mauvaise réponse lui retire 10 % de sa valeur, jusqu'à la moitié au plus.
- Les **bougies** allument les indices, un par un (souvent trois par énigme, du plus discret au plus direct). Tu commences avec 5 bougies, et chaque énigme résolue t'en rend une. Les indices ne coûtent pas d'étincelles.
- Après chaque énigme résolue, une **explication** détaille la solution.

## Le brouillon

Sur chaque énigme, un **brouillon** permet de griffonner par-dessus : stylo, rouge et gomme, pour poser un calcul ou marquer des cases.

## La fin

Quand tous les rouages sont rendus, l'horloge repart : une fin raconte la suite et affiche ton total d'étincelles. La barre du haut montre en permanence les rouages trouvés sur 192, tes étincelles et tes bougies.

## Données et synchronisation

Les énigmes résolues, tes essais, tes indices et tes bougies sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Le plugin ne demande aucune autre autorisation.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Valcendre → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).

## Nouveautés de la version 1.2.0

- **La Gare**, neuvième quartier, ouvert après 7 énigmes de l'Observatoire : Firmin le chef de gare propose 12 énigmes, dont deux nouveaux genres.
  - **Bagages** : pousse chaque malle sur une croix (flèches, boutons ou clic ; ANNULER reprend le dernier pas).
  - **Aiguillages** : relie les signaux de même couleur sans croiser les voies, en remplissant toute la grille.
- **Carnet** : depuis la carte, retrouve les énigmes réussies et rejoue-les, sans étincelles ni bougies en jeu (bouton REJOUER aussi sous l'explication).
- **Buts plus clairs** : le cadre « CE QU'IL FAUT TROUVER » dit vraiment ce qu'il faut faire, et comment jouer, pour une trentaine d'énigmes qui l'expliquaient mal.
- Numéros d'énigme dans chaque quartier, titres de la carte qui tiennent dans leur cadre, chemins de « D'un seul trait » bien visibles.
