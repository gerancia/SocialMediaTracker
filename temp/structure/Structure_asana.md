# 📊 Social Tracker — Structure Asana

## Informations du projet
- **Nom du projet** : Social Tracker
- **Objectif** : Extension Chrome de suivi mensuel des abonnés social media
- **Responsable** : Gerancia
- **Vue recommandée** : Board (Kanban)

---

## Colonnes du Board

```
À faire → En cours → En révision → Terminé
```

---

## Sections et Tâches

---

### 🗂️ PHASE 1 — Mise en place

- [ ] Créer le dossier du projet sur l'ordinateur
- [ ] Installer Visual Studio Code
- [ ] Créer le fichier `structure.md` de référence
- [ ] Créer le fichier `manifest.json` minimal
- [ ] Tester le chargement dans Chrome (mode développeur)
- [ ] Créer le fichier `generer_config.py`
- [ ] Créer le template Excel `societes.xlsx`
- [ ] Remplir l'Excel avec les vraies données des sociétés
- [ ] Lancer le script et vérifier le `config.js` généré
- [ ] Ajouter les vrais tokens API dans `config.js`

---

### 🎨 PHASE 2 — Interface (popup.html)
> Créer la fenêtre qui s'affiche quand on clique sur l'icône

- [ ] Créer le fichier `popup.html`
- [ ] Ajouter la structure HTML de base
- [ ] Ajouter le tableau de bord principaljo
- [ ] Ajouter la vue par pays / pôle / société
- [ ] Ajouter le graphique d'évolution
- [ ] Ajouter les boutons export CSV et Excel
- [ ] Styliser l'interface (CSS)
- [ ] Tester l'affichage dans Chrome

---

### ⚙️ PHASE 3 — Moteur (background.js)
> Créer le script qui tourne en arrière-plan

- [ ] Créer le fichier `src/background.js`
- [ ] Programmer l'alarme mensuelle automatique
- [ ] Écrire la fonction de collecte principale
- [ ] Écrire la fonction de sauvegarde dans `chrome.storage`
- [ ] Écrire la fonction de lecture des données
- [ ] Tester la collecte manuelle
- [ ] Tester la collecte automatique

---

### 🔌 PHASE 4 — APIs
> Connecter chaque réseau social un par un

- [ ] Créer `src/api_facebook.js` et tester
- [ ] Créer `src/api_instagram.js` et tester
- [ ] Créer `src/api_linkedin.js` et tester
- [ ] Créer `src/api_youtube.js` et tester
- [ ] Créer `src/api_tiktok.js` (scraping) et tester
- [ ] Vérifier que les données de toutes les sociétés remontent

---

### 📤 PHASE 5 — Export
> Permettre d'exporter les données collectées

- [ ] Créer `src/export.js`
- [ ] Écrire la fonction export CSV
- [ ] Écrire la fonction export Excel
- [ ] Tester l'export CSV
- [ ] Tester l'export Excel
- [ ] Vérifier que toutes les sociétés apparaissent dans l'export

---

### 🧪 PHASE 6 — Tests & Finalisation
> Vérifier que tout fonctionne avant utilisation réelle

- [ ] Tester la collecte complète sur toutes les plateformes
- [ ] Vérifier les données avec les vraies pages
- [ ] Tester l'export CSV et Excel
- [ ] Vérifier l'alarme mensuelle automatique
- [ ] Corriger les bugs éventuels
- [ ] Nettoyer le code
- [ ] Mettre à jour `structure.md`
- [ ] Installation finale sur l'ordinateur de travail

---

## Priorités des tâches

| Priorité | Description |
|---|---|
| 🔴 Haute | Bloquant — doit être fait avant de continuer |
| 🟡 Moyenne | Important mais pas bloquant |
| 🟢 Basse | Amélioration, peut attendre |

---

## Champs personnalisés à ajouter dans Asana

| Champ | Type | Valeurs |
|---|---|---|
| Priorité | Liste | 🔴 Haute / 🟡 Moyenne / 🟢 Basse |
| Fichier concerné | Texte | ex: background.js |
| Statut | Liste | À faire / En cours / En révision / Terminé |

---

## Ordre de réalisation recommandé

```
Phase 1 → Phase 3 → Phase 4 → Phase 2 → Phase 5 → Phase 6
  Base      Moteur    APIs    Interface   Export     Tests
```

> On fait le moteur avant l'interface car l'interface dépend des données
> que le moteur collecte.