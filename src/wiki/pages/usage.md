---
title: 2I2D Sin — Comment ça fonctionne ?
realTitle: Comment ça fonctionne ?
group: other
---

# Comment ça fonctionne ?

## Les moteurs

L'ensemble des pages ici fonctionne avec deux moteurs : Markdown et React.

* Le moteur **Markdown** (utilisé pour cette page) est réservé aux pages simples, sans code interactif.
* Le moteur **React** est utilisé pour les pages dynamiques ou interactives, par exemple [Annales du bac](/wiki/annales).

Vous pouvez voir le moteur utilisé en pied de page.

Nous allons parler uniquement du moteur Markdown pour le reste de la page, pour des raisons de simplicité.

## Markdown, c'est quoi ?

**Markdown** est un langage de balisage léger qui permet d’écrire du texte structuré avec une syntaxe simple, lisible, et rapide à apprendre.

Voici quelques exemples :

### Titres

~~~md
# Titre de niveau 1
## Titre de niveau 2
### Titre de niveau 3
~~~

### Texte en gras ou en italique

~~~md
**Texte en gras**
*Texte en italique*
~~~

**Texte en gras**
*Texte en italique*

### Listes

*Listes à puces*

~~~md
- Élément 1
- Élément 2
  - Sous-élément

<!-- Ou -->

* Élément 1
* Élément 2
  * Sous-élément
~~~

* Élément 1
* Élément 2
  * Sous-élément

*Listes ordonées*

~~~md
1. Élément 1
2. Élément 2
~~~

1. Élément 1
2. Élément 2

Il est possible d'imbriquer ces listes.

~~~md
1. fruits
   * pomme
   * banane
2. légumes
   - carotte
   - brocoli
~~~

1. fruits
   * pomme
   * banane
2. légumes
   - carotte
   - brocoli

### Liens

~~~md
[Accueil](/)
~~~

[Accueil](/)

### Code

*En ligne*

~~~md
Il y a `du code ici`.
~~~

Il y a `du code ici`.

*Bloc*

```md
~~~c
int main() { return 0; }
~~~
```

~~~c
int main() { return 0; }
~~~


### Mathématiques (avec TeX)

**Cette fonctionnalité n'est pas que sur le moteur de `mairech.cc`.**

*En ligne*

~~~md
La formule de la fonction <tex>f</tex> est <tex>f:x\rightarrow{x}^{2}</tex>.
~~~

La formule de la fonction <tex>f</tex> est <tex>f:x\rightarrow{x}^{2}</tex>.

*Bloc*

~~~md
<tex display>{x}^{2}</tex>

<tex display>
A = 2 \times \begin{bmatrix}
 1 & 2 \\
 3 & 4
\end{bmatrix} = \begin{bmatrix}
 2 & 4 \\
 6 & 8
\end{bmatrix}
</tex>
~~~

<tex display>{x}^{2}</tex>

<tex display>
A = 2 \times \begin{bmatrix}
 1 & 2 \\
 3 & 4
\end{bmatrix} = \begin{bmatrix}
 2 & 4 \\
 6 & 8
\end{bmatrix}
</tex>

* Pour savoir ce qui est pris en charge, regardez [Support Table • KaTeX](https://katex.org/docs/support_table).

## Mise en pratique

Quand vous modifiez ou créez une page Markdown, vous utilisez cette syntaxe.

C'est ce qui permet d’avoir des pages propres, claires, et faciles à maintenir, sans avoir besoin de connaître le HTML (il est possible d'utiliser du HTML dans le Markdown, c'est pris en charge).

Si vous avez besion d'aide pour une syntaxe, prenez exemple sur les autres pages ou sur internet directement.

## Créer une page

Il est assez facile de créer une page.

### 1. Créer le fichier du contenu

Pour créer le fichier de la page, il faut créer un fichier en `.md` dans le dossier `/src/wiki/pages`.

Par exemple, `example.md`.

Définissez ensuite les métadonnées de la page à l'intérieur. Vous devez mettre ça au début de la page.

~~~md
---
title: 2I2D Sin — Exemple
realTitle: Exemple
group: other
---

# Exemple
~~~

Ceci est un exemple.

### 2. Indexer la page

`mairech.cc` n'est pas capable de lire les fichiers Markdown tout seul, vous devez lui donner toutes les pages du wiki pour pouvoir les afficher.

Le fichier `/src/wiki/main.tsx` gère toutes les pages, vous devez le modifier. Vers le début de celui-ci, vous pourrez voir les définitions, c'est ici qu'il faut ajouter la nouvelle page :

~~~js
// ...
import * as example from "./pages/example.md";
bindPage("example", example.attributes, example.html, example.toc, "markdown");
// ...
~~~

**Attention: Ne modifiez pas "`markdown`", ceci permet de dire au système que le moteur Markdown doit être utiliser.**

### 3. Fin

Votre page est maintenant affiché sur la barre latérale. Le système gère automatiquement de la mise en page et de la table des matières.
