// src/popup.js

import { exportCSV, exportExcel } from './export.js'

// ── Variables globales ───────────────────────────────────────────────
let tousLesSnapshots = {}
let graphique        = null

// ── Chargement initial ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadData()
})

// ── Charger les données depuis chrome.storage ────────────────────────
function loadData() {
    chrome.storage.local.get('snapshots', (data) => {
        tousLesSnapshots = data.snapshots || {}

        if (!Object.keys(tousLesSnapshots).length) {
            displayNone()
            setStatus('Aucune donnée — cliquez sur Collecter', 'error')
            return
        }

        fillFilter()
        applyFilter()
        setStatus(`Dernière collecte : ${getLastMonth()}`, 'ok')
    })
}

// ── Remplir les filtres ──────────────────────────────────────────────
function fillFilter() {
    const dernierMois = getLastMonth()
    const resultats   = tousLesSnapshots[dernierMois]?.resultats || []

    // Pays
    const pays = ['tous', ...new Set(resultats.map(e => e.pays))]
    const selectPays = document.getElementById('filtre-pays')
    selectPays.innerHTML = pays.map(p =>
        `<option value="${p}">${p === 'tous' ? 'Tous les pays' : p}</option>`
    ).join('')

    // Pôles
    const poles = ['tous', ...new Set(resultats.map(e => e.pole))]
    const selectPole = document.getElementById('filtre-pole')
    selectPole.innerHTML = poles.map(p =>
        `<option value="${p}">${p === 'tous' ? 'Tous les pôles' : p}</option>`
    ).join('')

    // Mois
    const moisDispo = Object.keys(tousLesSnapshots).sort().reverse()
    const selectMois = document.getElementById('filtre-mois')
    selectMois.innerHTML = moisDispo.map((m, i) =>
        `<option value="${m}">${m}${i === 0 ? ' (dernier)' : ''}</option>`
    ).join('')
}

// ── Appliquer les filtres ────────────────────────────────────────────
function applyFilter() {
    const pays = document.getElementById('filtre-pays').value
    const pole = document.getElementById('filtre-pole').value
    const mois = document.getElementById('filtre-mois').value

    const snapshot = tousLesSnapshots[mois]
    if (!snapshot) return

    let resultats = snapshot.resultats

    // Filtrer par pays
    if (pays !== 'tous') {
        resultats = resultats.filter(e => e.pays === pays)
    }

    // Filtrer par pôle
    if (pole !== 'tous') {
        resultats = resultats.filter(e => e.pole === pole)
    }

    displayTable(resultats, mois)
    displayGraph(resultats, mois)
}

// ── Afficher le tableau ──────────────────────────────────────────────
function displayTable(resultats, mois) {
    const body = document.getElementById('tableau-body')

    if (!resultats.length) {
        body.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;color:#999;padding:20px">
                    Aucune donnée
                </td>
            </tr>`
        return
    }

    // Trouver le mois précédent pour l'évolution
    const moisTries = Object.keys(tousLesSnapshots).sort()
    const idx       = moisTries.indexOf(mois)
    const moisPrec  = idx > 0 ? moisTries[idx - 1] : null

    body.innerHTML = resultats.map(entite => {

        // Trouver la même société dans le mois précédent
        const entitePrec = moisPrec
            ? tousLesSnapshots[moisPrec]?.resultats?.find(
                e => e.societe === entite.societe && e.pays === entite.pays
              )
            : null

        return `<tr>
            <td><strong>${entite.societe}</strong></td>
            <td>${entite.pays}</td>
            ${displayCellule(entite.facebook?.abonnes,  entitePrec?.facebook?.abonnes)}
            ${displayCellule(entite.instagram?.abonnes, entitePrec?.instagram?.abonnes)}
            ${displayCellule(entite.linkedin?.abonnes,  entitePrec?.linkedin?.abonnes)}
            ${displayCellule(entite.youtube?.abonnes,   entitePrec?.youtube?.abonnes)}
            ${displayCellule(entite.tiktok?.abonnes,    entitePrec?.tiktok?.abonnes)}
            ${displayCellule(entite.twitter?.abonnes,   entitePrec?.twitter?.abonnes)}
        </tr>`
    }).join('')
}

// ── Afficher une cellule avec évolution ─────────────────────────────
function displayCellule(actuel, precedent) {
    if (actuel === null || actuel === undefined) {
        return `<td style="color:#ccc">—</td>`
    }

    let evo = ''
    if (precedent !== null && precedent !== undefined) {
        const diff = actuel - precedent
        const cls  = diff >= 0 ? 'up' : 'down'
        const sign = diff >= 0 ? '+' : ''
        evo = `<br><span class="${cls}">${sign}${fmt(diff)}</span>`
    }

    return `<td><span class="num">${fmt(actuel)}</span>${evo}</td>`
}

// ── Afficher le graphique ────────────────────────────────────────────
function displayGraph(resultats, moisActuel) {
    const moisTries = Object.keys(tousLesSnapshots).sort()
    const ctx       = document.getElementById('monGraphique').getContext('2d')
    const couleurs  = ['#1a73e8', '#ea4335', '#34a853', '#fbbc04', '#9c27b0', '#ff5722']

    const datasets = resultats.slice(0, 5).map((entite, idx) => ({
        label: entite.societe,
        data: moisTries.map(m => {
            const e = tousLesSnapshots[m]?.resultats?.find(
                r => r.societe === entite.societe && r.pays === entite.pays
            )
            // Total de tous les réseaux sociaux
            return [
                e?.facebook?.abonnes,
                e?.instagram?.abonnes,
                e?.linkedin?.abonnes,
                e?.youtube?.abonnes,
                e?.tiktok?.abonnes,
                e?.twitter?.abonnes
            ].reduce((acc, v) => acc + (v || 0), 0)
        }),
        borderColor:     couleurs[idx % couleurs.length],
        backgroundColor: couleurs[idx % couleurs.length] + '22',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        fill: false
    }))

    if (graphique) graphique.destroy()

    graphique = new Chart(ctx, {
        type: 'line',
        data: { labels: moisTries, datasets },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { font: { size: 11 }, boxWidth: 10 }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`
                    }
                }
            },
            scales: {
                x: { ticks: { font: { size: 10 } } },
                y: {
                    ticks: {
                        font: { size: 10 },
                        callback: v => fmt(v)
                    }
                }
            }
        }
    })
}

// ── Collecter maintenant ─────────────────────────────────────────────
window.collecter = async () => {
    const btn = document.getElementById('btn-collecter')
    btn.disabled = true
    setStatus('Collecte en cours...', 'loading')

    const res = await chrome.runtime.sendMessage({ type: 'COLLECTER_MAINTENANT' })

    btn.disabled = false
    if (res?.ok) {
        setStatus('Collecte terminée !', 'ok')
        loadData()
    } else {
        setStatus('Erreur lors de la collecte', 'error')
    }
}

// ── Export ───────────────────────────────────────────────────────────
window.doExportCSV   = () => exportCSV(tousLesSnapshots)
window.doExportExcel = () => exportExcel(tousLesSnapshots)

// ── Utilitaires ──────────────────────────────────────────────────────
function displayNone() {
    document.getElementById('tableau-body').innerHTML = ''
    document.querySelector('.chart-wrap').innerHTML = `
        <div class="empty">
            <div class="empty-icon">📭</div>
            <h3>Aucune donnée</h3>
            <p>Cliquez sur ↻ Collecter pour démarrer</p>
        </div>`
}

function setStatus(msg, etat) {
    document.getElementById('status-text').textContent = msg
    const dot = document.getElementById('status-dot')
    dot.className = 'dot ' + (
        etat === 'loading' ? 'loading' :
        etat === 'error'   ? 'error'   : ''
    )
}

function getLastMonth() {
    return Object.keys(tousLesSnapshots).sort().pop()
}

function fmt(n) {
    if (n === null || n === undefined) return '—'
    return new Intl.NumberFormat('fr-FR').format(n)
}