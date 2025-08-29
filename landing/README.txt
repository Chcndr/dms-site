DMS — Home "Orologio" (Rollback Package)

Contenuto:
- landing/home.html  → Snapshot SingleFile della versione funzionante (glow pulsanti, spotlight mouse, orologio ellittico sotto, video 16:9).

Istruzioni (rapide):
1) Sostituisci il file esistente in repository con questo:
   dms-site/landing/home.html
   (Questo file è self-contained: CSS e JS inline. Niente asset esterni richiesti.)

2) Facoltativo - micro-tweak dimensione viewport video (se serve):
   Cerca l'id #viewport e assicurati che abbia:

     #viewport{
       width: min(62vw, 960px);
       aspect-ratio: 16 / 9;
       height: auto;
       left: 50%; top: 50%;
       transform: translate(-50%, -50%);
     }

3) Commit & deploy:
   - Commit: revert(home): restore SingleFile snapshot + viewport tweak
   - Push su main e verifica con cache-bust:
     https://chcndr.github.io/dms-site/landing/home.html?v=rb1

Note:
- In home NON usare la mappa Italia di sfondo.
- Non toccare landing/mindmap.html in questo passaggio.
