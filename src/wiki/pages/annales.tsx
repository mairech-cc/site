export function AnnalesPage() {
  return (
    <>
      <h1 id="section-0">Annales du baccalauréat</h1>

      <h2 id="section-1">Épreuve de 2I2D</h2>

      <p>
        Cette section contient les sujets du baccalauréat technologique série STI2D de l'épreuve de 2I2D, contenant la
        partie commune (2I2D commun) et toutes spécialités (sauf indication contraire) avec un corrigé si disponible,
        classés par sessions et par régions.
      </p>

      <table>
        <caption>
          Sujets de 2021 à 2024 (nouveau bac)
        </caption>

        <thead>
          <tr>
            <th rowSpan={2} scope="col">Session</th>
            <th colSpan={2} scope="col">Métropole</th>
            <th colSpan={3} scope="col">Centres étrangers</th>
            <th rowSpan={2} scope="col">Sujets zéros</th>
          </tr>

          <tr>
            <th scope="col">Candidats libres</th>
            <th scope="col">Scolaires</th>

            <th scope="col">Mayotte–Liban</th>
            <th scope="col">Nouvelle–Calédonie</th>
            <th scope="col">Polynésie</th>
          </tr>
        </thead>

        <tbody>
          {/* 2024 */}
          <tr>
            <td>2024</td>
            <td colSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2024-metropole-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2024-polynesie-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
          </tr>

          {/* 2023 */}
          <tr>
            <td>2023</td>
            <td colSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2023-metropole-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2023-polynesie-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
          </tr>

          {/* 2022 */}
          <tr>
            <td rowSpan={2}>2022</td>
            <td colSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2023-metropole-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2022-mayotteliban-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2022-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2022-polynesie-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td rowSpan={2}>-</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2022-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
          </tr>

          {/* 2021 */}
          <tr>
            <td rowSpan={2}>2021</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-metropole-libre-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-metropole-libre-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>-</td>
            <td rowSpan={2}>-</td>
            <td rowSpan={2}>-</td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-zero1.pdf" target="_blank">Zéro 1</a>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2021-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        Les sujets avant 2021 sont de l'ancien bac avec l'épreuve d'Enseignements Technologiques Transversaux (ETT).
      </p>

      <table>
        <caption>
          Sujets de 2013 à 2020 (ancien bac)
        </caption>

        <thead>
          <tr>
            <th rowSpan={2} scope="col">Session</th>
            <th rowSpan={2} scope="col">Métropole</th>
            <th colSpan={2} scope="col">Centres étrangers</th>
          </tr>
          <tr>
            <th scope="col">Nouvelle-Calédonie</th>
            <th scope="col">Polynésie</th>
          </tr>
        </thead>

        <tbody>
          {/* 2020 */}
          <tr>
            <td>2020</td>
            <td>-</td>
            <td>-</td>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2020-polynesie-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
          </tr>

          {/* 2019 */}
          <tr>
            <td rowSpan={2}>2019</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2019-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>

          {/* 2018 */}
          <tr>
            <td rowSpan={2}>2018</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-metropole-remplacement-corrige.pdf">Corrigé</a>
            </td>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2018-polynesie-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
          </tr>

          {/* 2017 */}
          <tr>
            <td rowSpan={2}>2017</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-nouvellecaledonie-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-polynesie-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2017-polynesie-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>

          {/* 2016 */}
          <tr>
            <td rowSpan={2}>2016</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2016-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>

          {/* 2015 */}
          <tr>
            <td rowSpan={2}>2015</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2015-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>

          {/* 2014 */}
          <tr>
            <td rowSpan={2}>2014</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2014-polynesie-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
          </tr>

          {/* 2013 */}
          <tr>
            <td rowSpan={2}>2013</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-nouvellecaledonie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/2i2d-sujets/2013-metropole-remplacement-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="section-2">Épreuve de physique-chimie et mathématiques</h2>

      <p>
        Cette section contient les sujets du baccalauréat technologique série STI2D de l'épreuve de physique-chimie
        et mathématiques avec un corrigé si disponible, classés par sessions et par régions.
      </p>

      <table>
        <caption>
          Sujets de 2021 à 2024
        </caption>

        <thead>
          <tr>
            <th rowSpan={2} scope="col">Session</th>
            <th colSpan={2} scope="col">Métropole</th>
            <th colSpan={4} scope="col">Centres étrangers</th>
            <th rowSpan={2} scope="col">Sujets zéros</th>
          </tr>

          <tr>
            <th scope="col">Candidats libres</th>
            <th scope="col">Scolaires</th>

            <th scope="col">La Réunion</th>
            <th scope="col">Mayotte–Liban</th>
            <th scope="col">Nouvelle–Calédonie</th>
            <th scope="col">Polynésie</th>
          </tr>
        </thead>

        <tbody>
          {/* 2024 */}
          <tr>
            <td>2024</td>
            <td colSpan={2}>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2024-metropole-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2024-polynesie-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
          </tr>

          {/* 2023 */}
          <tr>
            <td rowSpan={2}>2023</td>
            <td colSpan={2}>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2023-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2023-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2023-lareunion-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2023-nouvellecaledonie-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2023-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>

          {/* 2022 */}
          <tr>
            <td rowSpan={2}>2022</td>
            <td colSpan={2}>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-mayotteliban-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-mayotteliban-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-polynesie-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-polynesie-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td>-</td>
          </tr>
          <tr>
            <td colSpan={2}>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2022-metropole-remplacement-sujet.pdf" target="_blank">Sujet</a>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>

          {/* 2021 */}
          <tr>
            <td rowSpan={2}>2021</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-metrocandlibre-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-metrocandlibre-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-metropole-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-metropole-corrige.pdf" target="_blank">Corrigé</a>
            </td>
            <td rowSpan={2}>-</td>
            <td rowSpan={2}>-</td>
            <td rowSpan={2}>-</td>
            <td rowSpan={2}>-</td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-zero1-sujet.pdf" target="_blank">Zéro 1</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-zero1-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
          <tr>
            <td>
              {"Remplacement : "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-metrocandlibre-remplacement-sujet.pdf" target="_blank">Sujet</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-metrocandlibre-remplacement-corrige.pdf" target="_blank">Sujet</a>
            </td>
            <td>
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-zero2-sujet.pdf" target="_blank">Zéro 2</a>
              {" - "}
              <a href="https://cdn.julman.fr/bucket/phymat-sujets/2021-zero2-corrige.pdf" target="_blank">Corrigé</a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
