# Rikardo TODO
Ovo je Rikardova jednostavna TODO aplikacija.

## Pokretanje aplikacije

Prije ikakvih daljnih koraka, potrebno je osigurati da je na sustavu instaliran [NodeJS](https://nodejs.org/en/) verzije 12 ili više s popratnom `npm` verzijom. Postojanje aplikacije je moguće provjeriti pokretanjem naredbe `node --version`. Rezultat pokretanja te naredbe bi trebao biti nešto poput `v12.16.3`. Sa svim instalacijma NodeJS takoder dolazi pomočni alat `npm`. To valja provjeriti pokretanjem naredbe `npm --version`. Ako i ovdje rezultat pokretanje bude nešto slično `6.14.4`, onda je sve spremno.

Da bi se aplikacija pokrenula, prvo je potrebno instalirati dependecy-je. To se radi pomoću naredbe `npm ci`. Kad naredba uspješno završi, u kazalu bi se trebalo pojaviti novo kazalo pod imenom `node_modules`. Ono sadrži sve potrebne datoteke za rad aplikacije.

Ako aplikaciju pokrenete prije nego što instalirate depenency-je, dobit ćete neki error te aplikacija neće raditi (npr. `Error: Cannot find module 'mariadb'`).

Sama aplikacija se pokreče tako da se pokrene `index.js` datoteka. To se može postiči pozivom naredbe `node index.js` ili, jednostavnije, samo `./index.js` (ako koristite UNIX sustav).

Aplikacija će se tad upaliti te će daljnje (relativno prijateljski formatirane) informacije davati preko STDOUT.

tl;dr
1. `npm ic`
2. `node index.js`

## Opis tehnologija

Aplikacija je napisana u JavaScript-u za [NodeJS](https://nodejs.org/en/) runtime i u [EJS](https://ejs.co/) templating jeziku.

### Logika
Sva aplikacijska logika nalazi se u datoteci `index.js`. Kao http server koristi se [express](https://expressjs.com/) koji je minimalni framework za web aplikacije. Kako bi se aplikacija spojila na bazu, koristi se `mariadb` adapter.

Informacije o spajanju na bazu mogu se iščitati iz varijable `dbSettings` pri vrhu datoteke.

Varijabla `serverSettings` drži informacije o tome na kojoj će mreži i vratima slušati server. Mreža `0.0.0.0` označava da zahtjevi na aplikaciju mogu doći od bilo kuda, dok će `127.0.0.1` označavati da zahtjevi moraju dolaziti s lokalne mreže.


### View-ovi
Aplikacijski view-ovi (datoteke koje opisuju što će se prikazati korisniku) nalaze se u `views` kazalu. Pisani su u tzv. [Embedded JavaScript](https://ejs.co/) formatu. Taj format je zapravo HTML s posebnim tagovima koji se prilikom renderanja zamijenjuju s određenim vrijednostima.
