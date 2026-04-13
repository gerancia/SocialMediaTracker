# 📊 Social Tracker — Extension Chrome/Edge

Suivi mensuel automatique des abonnés de vos pages LinkedIn, Instagram, Facebook et Twitter/X via APIs officielles.

---

## 🚀 Installation

1. copier le token Youtube dans le `config.js ` 
1. Ouvrez Chrome/Edge et allez sur `chrome://extensions/`
2. Activez le **Mode développeur** (en haut à droite)
3. Cliquez sur **"Charger l'extension non empaquetée"**
4. Sélectionnez le dossier `social-tracker-extension`
5. L'icône 📊 apparaît dans votre barre d'outils

---

## 📱 Utilisation

1. Cliquez sur l'icône 📊 dans votre barre d'outils
2. Allez dans **⚙ Config** et renseignez vos tokens et IDs
3. Cliquez **↻ Collecter** pour lancer une première collecte manuelle
4. Les données sont ensuite collectées **automatiquement chaque mois**

### Fonctionnalités
- **Tableau de bord** : Dernières données + évolution vs mois précédent
- **Historique** : Tableau complet filtrable par mois
- **Graphique** : Courbes d'évolution interactives
- **Export CSV** : Compatible Excel, Google Sheets
- **Export Excel** : Fichier `.xlsx` avec onglets par plateforme

---

## 🏗️ Structure du projet

```
social-tracker-extension/
├── manifest.json          # Configuration de l'extension
├── popup.html             # Interface principale
├── options.html           # Page de configuration
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── src/
    ├── background.js      # Service worker (collecte mensuelle)
    ├── api_linkedin.js    # Module LinkedIn API
    ├── api_facebook.js    # Module Facebook Graph API
    ├── api_instagram.js   # Module Instagram API
    ├── api_twitter.js     # Module Twitter API v2
    └── export.js          # Fonctions CSV & Excel
```

---

## ⚠️ Notes importantes

- Les tokens sont stockés localement dans `chrome.storage.local` (chiffrés par Chrome)
- L'extension nécessite de **visiter la page options** au moins une fois pour configurer les tokens
- La collecte automatique se déclenche toutes les 30 jours environ (via `chrome.alarms`)

---

## 🔧 Développement

Pour modifier l'extension, éditez les fichiers source et rechargez l'extension dans `chrome://extensions/` en cliquant sur l'icône ↻.
