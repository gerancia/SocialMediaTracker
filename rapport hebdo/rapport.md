# RÉSUMÉ HEBDOMADAIRE — Social Tracker
**Semaine du : [12/03/2026]**
**Responsable : [Gerancia]**

---

## Avancement global
```
████████░░░░░░░░░░░░   40%
```

---

## Ce qui est fait
La base du projet est terminée — structure, configuration et tous les modules de collecte des réseaux sociaux sont codés. L'API YouTube a été testée avec succès.

---

## Ce qui est bloqué
4 blocages identifiés liés au réseau de l'entreprise et aux accès API :
- **LinkedIn** → nécessite un accès compte administrateur entreprise
- **Facebook, Instagram, Twitter/X** → URLs bloquées sur le réseau entreprise
- **TikTok** → protection anti-scraping, à tester sur PC personnel

---

## Prochaines étapes
- Tester toutes les APIs sur PC personnel
- Résoudre l'accès LinkedIn via compte entreprise
- Coder l'interface et l'export des données

---

## Risques
Sans accès au PC personnel et au compte LinkedIn entreprise, les tests ne peuvent pas avancer. Ces deux éléments sont critiques pour la suite du projet.

## Pourquoi l'API et pas autre chose ?

#### 1. C'est la méthode officielle et légale
```
Le scraping viole souvent les conditions d'utilisation des réseaux sociaux. L'API est la méthode approuvée et recommandée par chaque plateforme.
```
#### 2. Données fiables à 100%
```
Les données viennent directement de la source — pas d'interprétation, pas d'erreur de lecture. Ce que l'API retourne est exact.
```
#### 3. Entièrement automatique
```
Une fois configuré, aucune intervention humaine n'est nécessaire. L'extension collecte toute seule chaque mois pour toutes les sociétés.
```
#### 4. Scalable
```
Aujourd'hui 50 sociétés, demain 200 — le système s'adapte sans modification ni effort supplémentaire.
```
#### 5. Gratuit
```
Toutes les APIs utilisées sont gratuites pour notre volume d'utilisation. On est très loin des limites imposées par les plateformes.
```
## Si quelqu'un propose le scraping à la place

```
Réponse : Le scraping est fragile et risqué —
si Facebook change son interface demain,
toute la collecte s'arrête sans prévenir.
Avec l'API, Facebook nous prévient
des changements à l'avance.
```

## Si quelqu'un parle des blocages actuels
```
Réponse : Les blocages sont temporaires —
ils sont liés au réseau entreprise
et aux accès administrateur.
Une fois résolus, la solution
est opérationnelle définitivement.
```

resoudre l'accees, 