# Social Tracker Media — Structure du projet

## Déscription

Un **extension Chrome** qui collecte automatiquement chaque mois
le nombre d'abonnés de toutes les pages social media du groupe AXIAN pour tous les pays, toutes les marques et centralise tout dans un seul tableau de bord.

## Etape 1

### Recuperation de l'ID de chaque page

```
|Plateforme   | Où trouver l'ID              | Difficulté |
-----------------------------------------------------------
| Facebook    | URL ou Paramètres de la page | Facile     |
-----------------------------------------------------------
| Instagram   | Via l'API Facebook           | Difficile  |
-----------------------------------------------------------
| LinkedIn    | URL de la page entreprise    | Facile     |
-----------------------------------------------------------
| YouTube     | URL de la chaîne             | Facile     |
-----------------------------------------------------------
| TikTok      | Nom d'utilisateur (@)        | Facile     |
-----------------------------------------------------------
```
## Etape 2

### Arborescence

```
tracker/
├── manifest.json          
├── popup.html             
├── options.html
├── ....      
├── icons/
│   ├── icon1
│   ├── icon2
│   └── icon3
└── src/
    ├── background.js      
    ├── api_facebook.js    
    ├── api_instagram.js   
    ├── api_linkedin.js    
    ├── api_youtube.js     
    ├── api_tiktok.js      
    └── export.js       
```

---

## Description des fichiers

### `manifest.json`
La **carte d'identité** de l'extension. Obligatoire, c'est le seul fichier avec un nom imposé par le navigateur (chrome). Il déclare le nom, la version, les permissions et indique où se trouvent les autres fichiers.

### `popup.html`
La **fenêtre** qui s'ouvre quand on cliques sur l'icône de l'extension dans Chrome. C'est ici qu'on affiche les données, les graphiques et les boutons d'export.

### `options.html`
La **page de configuration**. C'est ici que tu saisiras les tokens API et les IDs de chaque page par entité.

### `icons/`
Les **icônes** de l'extension affichées dans Chrome. Trois tailles obligatoires : 16px, 48px et 128px.

### `src/background.js`
Le **moteur invisible**. Tourne en arrière-plan sans que tu le voies. C'est lui qui déclenche la collecte automatique chaque mois et qui gère le stockage des données.

### `src/api_facebook.js`
Module qui s'occupe d'appeler l'**API Facebook** et de récupérer le nombre d'abonnés de chaque page Facebook.

### `src/api_instagram.js`
Module qui s'occupe d'appeler l'**API Instagram** (via Facebook Graph API) et de récupérer le nombre d'abonnés.

### `src/api_linkedin.js`
Module qui s'occupe d'appeler l'**API LinkedIn** et de récupérer le nombre de followers de chaque page entreprise.

### `src/api_youtube.js`
Module qui s'occupe d'appeler l'**API YouTube** et de récupérer le nombre d'abonnés de chaque chaîne.

### `src/api_tiktok.js`
Module qui s'occupe de récupérer le nombre d'abonnés TikTok. ⚠️ Pas d'API officielle, utilise le scraping de la page. alors que scraping ne marche pas par ce que tiktok  a securiser son app, et il ne retourne pas le nombre de followers dans l'html

### `src/export.js`
Module qui gère l'**export des données** en fichier CSV et Excel à partir des données stockées.

---

## Ordre de développement

```
1. manifest.json     → poser les bases
2. popup.html        → créer l'interface
3. options.html      → créer la configuration
4. background.js     → automatiser la collecte
5. api_*.js          → connecter les APIs une par une
6. export.js         → ajouter l'export CSV / Excel
```

## PROBLEMATIQUE

***TikTok*** n'a pas d'API publique officielle accessible gratuitement comme les autres plateformes. Deux options possibles :

**Scraping** : lire le nombre d'abonnés directement sur la page TikTok lors de la visite. Simple à mettre en place mais fragile — si TikTok modifie son interface, le code se casse.

**TikTok for Business API** : API officielle mais réservée aux grandes entreprises ***donc c'est pour la version PROD***, avec un processus d'approbation long et restrictif.

Choix retenu : scraping, en attendant qu'une API accessible soit disponible.