import { CONFIG } from '../config.js'
import { getYoutubeAbonnes }   from './api_youtube.js'

// ── Installation ─────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    console.log('[SocialTracker] Extension installée ✅')

    // Alarme mensuelle pour YouTube
    chrome.alarms.create('collecte-mensuelle', {
        periodInMinutes: 60 * 24 * 30
    })
})

// ── Alarme mensuelle ─────────────────────────────────────────────────
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'collecte-mensuelle') {
        collecter()
    }
})

// ── Collecte API (YouTube, LinkedIn, Twitter) ────────────────────────
async function collecter() {
    console.log('[SocialTracker] Collecte démarrée...')

    const mois      = getMoisActuel()
    const resultats = []

    for (const entite of CONFIG.entites) {
        if (!entite.actif) continue

        const donnees = {
            pays:      entite.pays,
            pole:      entite.pole,
            societe:   entite.entite,
            ville:     entite.ville,
            youtube:   null,
            linkedin:  null,
            twitter:   null,
            facebook:  null,
            instagram: null,
            tiktok:    null
        }

        // YouTube
        if (entite.youtube) {
            try {
                donnees.youtube = await getYoutubeAbonnes(
                    entite.youtube,
                    CONFIG.tokens.youtube
                )
            } catch (e) {
                console.error(`[SocialTracker] YouTube erreur ${entite.entite}:`, e)
            }
        }

        // linkedin, Facebook, Instagram, TikTok → récupérés depuis temp storage
        donnees.linkedin  = await getTempData('linkedin_temp',  entite.linkedin)
        donnees.facebook  = await getTempData('facebook_temp',  entite.facebook)
        donnees.instagram = await getTempData('instagram_temp', entite.instagram)
        donnees.tiktok    = await getTempData('tiktok_temp',    entite.tiktok)
        donnees.twitter = await getTempData('twitter_temp', entite.X)

        resultats.push(donnees)
    }

    await sauvegarder(mois, resultats)
    console.log(`[SocialTracker] Collecte terminée pour ${mois} ✅`)
}

// ── Récupérer les données temp des content scripts ───────────────────
function getTempData(cle, nomPage) {
    return new Promise((resolve) => {
        if (!nomPage) {
            resolve(null)
            return
        }

        chrome.storage.local.get(cle, (data) => {
            const temp    = data[cle] || {}
            const entite  = temp[nomPage]

            if (entite) {
                resolve({ abonnes: entite.abonnes })
            } else {
                resolve(null)
            }
        })
    })
}

// ── Sauvegarder le snapshot mensuel ─────────────────────────────────
function sauvegarder(mois, resultats) {
    return new Promise((resolve) => {
        chrome.storage.local.get('snapshots', (data) => {
            const snapshots = data.snapshots || {}

            snapshots[mois] = {
                resultats:  resultats,
                collecteAt: new Date().toISOString()
            }

            chrome.storage.local.set({ snapshots }, () => {
                console.log(`[SocialTracker] Snapshot ${mois} sauvegardé ✅`)
                resolve()
            })
        })
    })
}

// ── Messages depuis popup.js et content scripts ──────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // ── Vérifier l'origine du message ────────────────────────────
    if (sender.id !== chrome.runtime.id) {
        console.warn('[SocialTracker] Message rejeté — origine inconnue')
        return
    }

    // ── Bouton Collecter maintenant ──────────────────────────────
    if (message.type === 'COLLECTER_MAINTENANT') {
        collecter().then(() => sendResponse({ ok: true }))
        return true
    }

    // ── GET_DATA ─────────────────────────────────────────────────
    if (message.type === 'GET_DATA') {
        chrome.storage.local.get('snapshots', (data) => {
            sendResponse({ snapshots: data.snapshots || {} })
        })
        return true
    }

    // ── Facebook ─────────────────────────────────────────────────
    if (message.type === 'FACEBOOK_DATA') {
        if (!validerMessage(message, 'nomPage')) return
        sauvegarderTemp('facebook_temp', message.nomPage, message.abonnes, message.collecteAt)
    }

    // ── Instagram ────────────────────────────────────────────────
    if (message.type === 'INSTAGRAM_DATA') {
        if (!validerMessage(message, 'username')) return
        sauvegarderTemp('instagram_temp', message.username, message.abonnes, message.collecteAt)
    }

    // ── TikTok ───────────────────────────────────────────────────
    if (message.type === 'TIKTOK_DATA') {
        if (!validerMessage(message, 'username')) return
        sauvegarderTemp('tiktok_temp', message.username, message.abonnes, message.collecteAt)
    }

    // ── Twitter ──────────────────────────────────────────────────
    if (message.type === 'TWITTER_DATA') {
        if (!validerMessage(message, 'username')) return
        sauvegarderTemp('twitter_temp', message.username, message.abonnes, message.collecteAt)
    }
    // Likedin
    if (message.type === 'LINKEDIN_DATA') {
        if (!validerMessage(message, 'nomPage')) return
            sauvegarderTemp('linkedin_temp', message.nomPage, message.abonnes, message.collecteAt)
    }
})


// ── Valider les données reçues ───────────────────────────────────────
function validerMessage(message, cleNom) {
    // Vérifier le nom de la page
    if (!message[cleNom] || typeof message[cleNom] !== 'string') {
        console.warn('[SocialTracker] Données invalides — nom manquant')
        return false
    }

    // Vérifier le nombre d'abonnés
    if (!message.abonnes || typeof message.abonnes !== 'number') {
        console.warn('[SocialTracker] Données invalides — abonnés manquants')
        return false
    }

    // Vérifier que le nombre est réaliste
    if (message.abonnes < 0 || message.abonnes > 1_000_000_000) {
        console.warn('[SocialTracker] Données invalides — nombre hors limites')
        return false
    }

    return true
}


// ── Sauvegarder les données temp ─────────────────────────────────────
function sauvegarderTemp(cle, nomPage, abonnes, collecteAt) {
    chrome.storage.local.get(cle, (data) => {
        const temp = data[cle] || {}
        temp[nomPage] = { abonnes, collecteAt }
        chrome.storage.local.set({ [cle]: temp })
    })
}

// ── Utilitaires ──────────────────────────────────────────────────────
function getMoisActuel() {
    const now = new Date()
    const m   = String(now.getMonth() + 1).padStart(2, '0')
    return `${now.getFullYear()}-${m}`
    // → "2026-03"
}
