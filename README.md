# GSZI tabló weboldal

## Előkészületek nem technikai karbantartóknak

A karbantartáshoz vagy tablók feltöltéséhez különböző programokat kell használni, melyeket valószínű eddig még nem használt.

### Parancssor

Először, ismerje meg a Windows parancssort. Ezt több féle képpen is elindíthatja.

- Nyissa meg a Windows start menüt, és gépelje be a `cmd`-t, majd nyomjon Enter-t.
- A fájlkezelő címsorába (ahol az elérési útvonal van), írja be a `cmd`-t.

Ebben a programban lehet programokat indítani, vagy másképp fogalmazva, parancsokat futtatni.

A következő parancsokat próbálhatja ki, hogy megismerkedjen a parancssorral:

- `echo Szia` - Ez egyszerűen kiírja a "Szia" szöveget a parancssorra.
- `date /t` - Kiírja a mai dátumot. Ha a `/t`-t nem írja a végére, akkor lecseréli a dátumot a beírt értékre. Ha véletlen mégis lefelejti a `/t`-t, nyomja le a CTRL+C billentyűkombinációt (ugyan az mint más programokban a másolás), ez kilép a programból és nem módosítja a dátumot.
- `exit` - Ez bezárja a parancssort (az ablakon van egy X gomb, mint minden más ablaknál is, azzal is bezárhatja).

A parancssorban az összes parancsot és a parancsok eredményét nyomon követheti.
A parancssor egy sorának az elején találhat egy ilyen szöveget: `C:\users\valaki>` (a felhasználótól függ).
Ez a parancssor aktuális mappáját jelzi. Néhány parancsnak fontos, hogy melyik az aktuális mappa, valamelyiknek nem.
A fenti parancsoknak mindegy, hogy mi az aktuális mappa.
A következők viszont különböző eredményeket ad vissza, ha más az aktuális mappa:

- `cd ValamilyenMappa` - Belép egy al-mappába (az aktuális mappa a megadott al-mappa lesz) (ebben a példában az al-mappa neve `ValamilyenMappa`)
- `cd ..` - Kilép az aktuális mappából (az aktuális mappa a "szülőmappa" lesz)
- `dir` - Kilistázza az aktuális mappa fájljait és al-mappáit. A lista tetején van két extra elem: `.` és `..`. A `.` az aktuális mappa, a `..` pedig a "szülőmappa".

### Node.JS

A weboldalokon három főbb programozási nyelvvel találkozhat:

- HTML - Tartalmazza a szöveget, gombokat, beviteli mezőket.
- CSS - Az oldal stílusát tartalmazza. (betűtípus, háttérszín, betűméret, margók, szegélyek)
- JavaScript - Az oldal funkcionalitásáért, működéséért felel. (beírt értékek ellenőrzése, adatok automatikus frissítése, kommunikálás a szerverrel) Fontos, hogy ez nem az adatok tárolásáért, vagy a bejelentkezésért felel. Az a szerver feladata. JavaScript a webböngészőben dolgozik.

A Node.JS JavaScript kódokat tud futtatni webböngésző nélkül. Ez azért kell a projecthez, mert a tablóképek optimalizálása, egyéb adatok generálása és a weboldal tömörítése (hogy gyorsabb legyen) JavaScript kóddal van megoldva.

### JSON

Ez nem egy program, hanem egy leírónyelv, amellyel dolgoznia kell majd. Ez a formátum programok által egyszerűen feldolgozható, és emberek által is olvasható.

A JSON-ben különböző típusú adatokat lehet tárolni: szöveget, számot, igen/nem értéket, listát és objektumot.

Egy objektum valahogy így néz ki:

```json
{
    "Ballagas": 2025,
    "Osztaly": "13C",
    "Tablokep": "2025_13C.jpg"
}
```

Ahogy látja, egy `{`-el kezdődik és `}`-el végződik. Az objektum elemeinek nevei és értékei vannak. A neveket `"`-k közé kell tenni, és az elemeket `,`-vel kell elválasztani (az utolsó elem után NE tegyen `,`-t).

Egy lista valahogy így néz ki:

```json
[
    "Nincs",
    "Ötletem",
    "Nevekhez"
]
```

Ez `[`-vel kezdődik és `]`-vel végződik. Az objektummal ellentétben, az elemekenek nincsenek nevei. Ez csak egy lista.

### Filezilla

A weboldal egy szerverről van szolgáltatva. Ha a projecten módosítás történt, fel kell tölteni a fájlokat a szerverre, hogy az iskola oldalán is frissüljön. A fájlfeltöltés a Filezilla segítségével történik. (vagy más FTP klienssel, de ez a legegyszerűbb)
Töltse le a Filezillat innen: https://filezilla-project.org/download.php?type=client

## Előkészületek a fejlesztéshez/karbantartáshoz/tablók feltöltéséhez

1. Töltse le a Node.JS futtatókörnyezetet innen: https://nodejs.org/en/download
2. Ellenőrizze, hogy helyesen telepítette:

    > Ezeket a parancsokat a parancssorban futtassa. (mindegy, hogy mi az aktuális mappa)

    - Futtassa a `node --version` parancsot - Ha egy verziószámot ad eredményül (pl `v22.18.0`) akkor jó.
    - Futtassa a `npm --version` parancsot - Megint, ha egy verziószámot ad eredményül (pl `11.5.2`) akkor jó.

3. Töltse le a projectet. Ezt két féle képpen teheti meg.

    - Letöltés a GitHub-ról .zip fájlként (egyszerűbb)
        1. Töltse le a .zip fájlt innen: https://github.com/BBpezsgo/CSB.Tablok.io/archive/refs/heads/main.zip
        2. Csomagolja ki a letöltött .zip fájlt.
    - `git` parancs használata (ezt telepítheti innen: https://git-scm.com/downloads)
        1. Nyissa meg a parancssort egy mappában, ahova letölteni szeretné a projectet. (írja be a Fájlkezelő címsorába, hogy `cmd`)
        2. Futtassa a `https://github.com/BBpezsgo/CSB.Tablok.io.git` parancsot.
        3. A project a `CSB.Tablok.io` mappában található.

4. Nyissa meg a project mappáját (amiben olyan mappák vannak hogy `docs`, `src` és olyan fájlok hogy `.gitignore`, `compress-images`, stb) a parancssorban (írja be a Fájlkezelő címsorába, hogy `cmd`)
5. Futtassa az `npm i` parancsot. Ez letölti a szükséges kódokat a projecthez (a képek tömörítését például nem én írtam meg, hanem felhasználtam már meglévő kódokat, ezeket le kell tölteni).

## Új tabló feltöltése

Egy tablóhoz több elem tartozik, hogy működjön:

- Tablókép
- Alapadatok (ballagási dátum, osztályfőnök neve, névsor, stb)
- Optimalizált tablókép (ezt később generálja majd, ha megvan a tablókép)
- Tablókép domináns színe (amíg nem tölt be a tablókép az oldalon, addig ez a szín fog megjelenni. ezt is később generálja majd)

1. Először, rakja a tablóképet a `/docs/img/tablos` mappába.
    Ügyeljen a rendezettségre. A fájl neve lehetőleg legyen `Ballagási Dátum_Osztály`. Például 2025_13C. (ahogy a többi)
2. Nyissa meg a `/docs/database/tablos.json` fájlt. Egyszerűbb, ha [Visual Studio Code](https://code.visualstudio.com/Download)t használ, de lehet Notepadban is, de abban kissé nehezebb lesz.
    Ez egy JSON fájl, ami egy listát tartalmaz (lista, amiben objektumok vannak). Láthatja a `[`-t a fájl tetején, és a `]`-t a fájl végén.
3. Görgessen legalulra (rendezettség miatt az új tablók legyenek legalul).
4. Vagy másolja ki az utolsó elemet, vagy gépejle be manuálisan, a megfelelő értékekkel.
    Például:

    - "Grade" - Az osztály (ez a JSON-ben külön van szedve) (pl 13/C)
    - "FinishedAt" - Ballagási év (pl 2025)
    - "Ofo" - Az osztályfőnök (pl Dávidné Kovalcsik Gabriella)
    - "Department" - A szak (pl Rendszerinformatikus)
    - "Image" - A tablókép fájl neve (pl 2025_13C.jpg)
    - "Students" - A névsor
    - "Sources" - A források (vannak, amelyek Excel táblázatokból és egyéb forrásokból vannak. Ha ön tanár, akkor maga a forrás, ami VERIFIED_SOURCE)

    ```json
    {
        "Grade": { "Grade": 13, "Sub": "C" },
        "FinishedAt": 2025,
        "Ofo": "Dávidné Kovalcsik Gabriella",
        "Department": "Informatikai Szakmacsoport szak",
        "Image": "2025_13C.jpg",
        "Students": [
            "Nincs",
            "Ötletem",
            "Nevekhez"
        ],
        "Sources": [ "VERIFIED_SOURCE" ]
    }
    ```

    Ügyeljen arra, hogy az előző elem végén nem szerepel `,`. Mível új elemet ad hozzá, tegyen `,` az előző elem végére. (Az utolsó elem végére NE tegyen `,`-t)

5. Generálja le az optimalizált tablóképeket (írtam hozzá programot)
    1. Nyisson parancssort a project mappájában (a Fájlkezelő címsorába írja be, hogy `cmd`)
    2. Futtassa a `node compress-images.js` parancsot.

6. Generálja le a domináns színeket (ehhez is írtam programot)
    1. Nyisson parancssort a project mappájában (a Fájlkezelő címsorába írja be, hogy `cmd`)
    2. Futtassa a `node generate-colors.js` parancsot.

    > A `node compress-images.js` és `node generate-colors.js` parancs az összes képet és színt újragenerálja. Ezt még javítanom kell, hogy csak az új tablókkal foglalkozzon.

A módosítások követése érdekében, minden változtatásnál adja meg a módosítás dátumát és rövid címet/leírást.

7. Nyissa meg a `/docs/database/versions.json` **JSON** fájlt. Ez tartalmazza az előző módosításokat, és opcionálisan leírásokat, hogy mi történt.

    Adjon hozzá egy új elemet a fájl tetején. (másolhatja a legfelső elemet, és írja át a dátumot, leírást)

    Például:

    ```json
    {
        "date": "2025. 8. 27.",
        "title": "2025-ös év tablói feltöltése"
    }
    ```

    Ügyeljen arra, hogy az új elem után kell egy `,`-t tennie, mert ez után van több elem is a listában.

Olvasson tovább, hogy [hogyan tudja feltölteni](#módosítások-feltöltése-hogy-frissüljön-az-iskola-weboldalán-is), vagy hogy hogyan tudja [tesztelni, hogy minden működik](#tesztelés-az-ön-gépén)-e.

## Tesztelés az ön gépén

Ha meg akar győződni, hogy működik-e minden, tesztelheti a saját gépén, mielőtt feltölti az iskola weboldalára.

1. Nyisson parancssort a project mappájában (fájlkezelő címsorába írja, hogy `cmd`)
2. Futtassa a `npm run serve` parancsot
    A parancssorban meg fog jelenni egy hasonló szöveg:

    ```log
    > serve
    > webpack serve

    <i> [webpack-dev-server] Project is running at:
    <i> [webpack-dev-server] Loopback: http://localhost:9000/
    <i> [webpack-dev-server] On Your Network (IPv4): http://192.168.1.100:9000/
    <i> [webpack-dev-server] Content not from webpack is served from '/home/BB/Projects/CSB.Tablok.io/docs' directory

    ...
    ```

    Itt a `Loopback` linken tudja elérni a weboldal teszt verzióját. Ez ebben a példában http://localhost:9000/.

Ha ki akar lépni a tesztelésből, nyomja le a CTRL+C billentyűkombinációt (ugyan az mint a többi programban a másolás).

## Módosítások feltöltése (hogy frissüljön az iskola weboldalán is)

Nyissa meg a Filezillat.

Hogy csatlakozni tudjon a szerverhez, kell annak a címe, egy felhasználónév és jelszó. Ezeket privált üzenetben küldöm el. (és ezek mardjanak privátak)

Felül, írja be a Hostot, Usernamet és Passwordot.

A bal oldali fájlkezelő az ön gépe, a jobb oldal pedig a szerver.

A bal oldalon navigáljon a Project mappába, azon belül pedig a `docs` mappába.
A jobb oldalon maradjon a `/` mappában.

Érdemes könyvjelzőt létrehozni, hogy az ön gépén szereplő mappa szinkronizálva legyen a szerveren szereplő mappával (így Filezilla tudja hogy mit hova kell majd feltölteni)

1. Legfelül tud létrehozni egy könyvjelzőt. (`Bookmarks` -> `Add bookmark...`)
2. Pipálja be a `Use synchronized browsing` opciót.
3. Kész

Ha a bal oldalon belép egy mappába, akkor a jobb oldalon automatikusan navigál majd.

A bal oldalról töltse fel a módosított/új fájlokat. (jobb klikk, Feltöltés/Upload)
Ezek általában a következők:

- `/docs/img/tablos` - Tablóképek
- `/docs/img/tablos-lowres` - Optimalizált tablóképek
- `/docs/database/colors.json` - Generált domináns színek
- `/docs/database/tablos.json` - Tablók adatai
- `/docs/database/versions.json` - Módosítások

## Technikai információk

Ez egy statikus weboldal. A scriptek TypeScriptben vannak, és Webpacket használ a fordításra.
A weboldal gyökérkönyvtára a `/docs`, minden ezen kívül a fejlesztéshez szükséges.
A `/src` könyvtárban található a TypeScript forráskód.

A tablók egy JSON fálban vannak tárolva. A tablóképek eredeti formában is mentve vannak, de minden képhez van egy hozzá tartozó alacsony minőségű (automatikusan generált) kép is, hogy a weboldal gyorsabban betöltsön.
