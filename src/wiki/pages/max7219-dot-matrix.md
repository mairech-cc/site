---
title: 2I2D Sin — MAX7219 Dot Matrix
realTitle: MAX7219 Dot Matrix
group: compounds
---

# MAX7219 Dot Matrix

MAX7219 Dot Matrix (en français : *matrice de points*) est un composant utilisé pour afficher une grille de pixels. Pour fonctionner, le composant doit être connecté à l'aide de trois broches d'entrée, l'alimentation et de la terre :

- `VCC`, alimentation 5 V, connectée au 5 V de l'Arduino ;
- `GND`, terre, connectée à la terre ;
- `DIN`, transmission des données ;
- `CS`, sélection du composant ;
- `CLK`, horloge.

Notez qu'aucune résistance n'est nécessaire lors de la connexion des broches. 

## Mise en série

Ce composant est capable de fonctionner en série, c'est-à-dire qu'il est possible de contrôler plusieurs MAX7219 Dot Matrix en utilisant qu'une seule connexion au contrôleur (Arduino ou autre).

Pour cela, il faut connecter le premier composant au contrôleur en connectant les cinq broches. Pour connecter les autres, il faut les connecter l'un à la suite des autres en suivant ce tableau : 

<table>
  <caption>Connexion entre les composants consécutifs</caption>
  <thead>
    <tr>
      <th>Composant précédent (sorties)</th>
      <th rowspan="6">➡️</th>
      <th>Composant suivant (entrées)</th>
    </tr>
    <tr>
      <td><code>VCC</code></td>
      <td><code>VCC</code></td>
    </tr>
    <tr>
      <td><code>GND</code></td>
      <td><code>GND</code></td>
    </tr>
    <tr>
      <td><code>DOUT</code></td>
      <td><code>DIN</code></td>
    </tr>
    <tr>
      <td><code>CS</code></td>
      <td><code>CS</code></td>
    </tr>
    <tr>
      <td><code>CLK</code></td>
      <td><code>CLK</code></td>
    </tr>
  </thead>
</table>

## Programmation 

Pour faciliter l’interaction avec le composant, il est possible d'utiliser une librairie Arduino, plus précisément la librairie "[LedControl](https://github.com/wayoda/LedControl)".

Voici un exemple de programme Arduino pour contrôler une matrice de points :

~~~cpp
/**
 * Code pour afficher une émoticône "sourire" 😀 avec les 8x8 LED.
 * 2024, Juliano Mandrillon - CC0 (Domaine public)
 *
 * Matériels nécessaires :
 *  - Carte Arduino (adapter les pins si nécessaire, x1) 
 *  - Câbles Dupont (x5)
 *  - MAX7219 Dot Matrix (x1)
 *
 * Carte utilisée pour tests:
 *  - Arduino MEGA2650
 */

#include <LedControl.h>

// Pin 12 est DIN ;
// Pin 11 est CLK ;
// Pin 10 est CS ;
// Le dernier argument (1) indique à la librairie qu'un seul composant est connecté.
LedControl lc = LedControl( 12, 11, 10, 1 );

uint8_t rows[8] = {
  0b00000000,
  0b00100100,
  0b00100100,
  0b00000000,
  0b01000010,
  0b01000010,
  0b00111100,
  0b00000000,
};

void setup( void )
{
  // Réveil
  lc.shutdown( 0, false );
  // Définition de l'intensité
  lc.setIntensity( 0, 8 );
  // Réinitialisation des pixels
  lc.clearDisplay( 0 );
}

void loop( void )
{
  // Écriture des lignes
  for ( int32_t i = 0 ; i < 8 ; i++ )
  {
    lc.setRow( 0, i, rows[i] );
  }

  delay( 1000 );
}
~~~
