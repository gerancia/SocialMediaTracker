// src/background.js

import { CONFIG } from '../config.js'
import { getYoutubeAbonnes }   from './api_youtube.js'
import { getLinkedinAbonnes }  from './api_linkedin.js'
// import { getXAbonnes }   from './api_x.js'

// ── Installation ─────────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
    console.log('[SocialTracker] Extension installée ✅')

    // Alarme mensuelle pour YouTube, LinkedIn, Twitter
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

        // LinkedIn
        if (entite.linkedin) {
            try {
                donnees.linkedin = await getLinkedinAbonnes(
                    entite.linkedin,
                    CONFIG.tokens.linkedin
                )
            } catch (e) {
                console.error(`[SocialTracker] LinkedIn erreur ${entite.entite}:`, e)
            }
        }

        // X
        // if (entite.x) {
        //     try {
        //         donnees.x = await getXAbonnes(
        //             entite.x,
        //             CONFIG.tokens.x
        //         )
        //     } catch (e) {
        //         console.error(`[SocialTracker] Twitter erreur ${entite.entite}:`, e)
        //     }
        // }

        // Facebook, Instagram, TikTok → récupérés depuis temp storage
        donnees.facebook  = await getTempData('facebook_temp',  entite.facebook)
        donnees.instagram = await getTempData('instagram_temp', entite.instagram)
        donnees.tiktok    = await getTempData('tiktok_temp',    entite.tiktok)
        donnees.x = await getTempData('twitter_temp', entite.x)

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

    // Bouton "Collecter maintenant" depuis le popup
    if (message.type === 'COLLECTER_MAINTENANT') {
        collecter().then(() => sendResponse({ ok: true }))
        return true
    }

    // Données GET depuis popup
    if (message.type === 'GET_DATA') {
        chrome.storage.local.get('snapshots', (data) => {
            sendResponse({ snapshots: data.snapshots || {} })
        })
        return true
    }

    // ── Content Scripts ──────────────────────────────────────────

    // Facebook
    if (message.type === 'FACEBOOK_DATA') {
        console.log(`[SocialTracker] Facebook : ${message.nomPage} → ${message.abonnes}`)
        chrome.storage.local.get('facebook_temp', (data) => {
            const temp = data.facebook_temp || {}
            temp[message.nomPage] = {
                abonnes:    message.abonnes,
                collecteAt: message.collecteAt
            }
            chrome.storage.local.set({ facebook_temp: temp })
        })
    }

    // Instagram
    if (message.type === 'INSTAGRAM_DATA') {
        console.log(`[SocialTracker] Instagram : @${message.username} → ${message.abonnes}`)
        chrome.storage.local.get('instagram_temp', (data) => {
            const temp = data.instagram_temp || {}
            temp[message.username] = {
                abonnes:    message.abonnes,
                collecteAt: message.collecteAt
            }
            chrome.storage.local.set({ instagram_temp: temp })
        })
    }

    // TikTok
    if (message.type === 'TIKTOK_DATA') {
        console.log(`[SocialTracker] TikTok : @${message.username} → ${message.abonnes}`)
        chrome.storage.local.get('tiktok_temp', (data) => {
            const temp = data.tiktok_temp || {}
            temp[message.username] = {
                abonnes:    message.abonnes,
                collecteAt: message.collecteAt
            }
            chrome.storage.local.set({ tiktok_temp: temp })
        })
    }
    // X
    if (message.type === 'TWITTER_DATA') {
        console.log(`[SocialTracker] Twitter : @${message.username} → ${message.abonnes}`)
        chrome.storage.local.get('twitter_temp', (data) => {
            const temp = data.twitter_temp || {}
            temp[message.username] = {
                abonnes:    message.abonnes,
                collecteAt: message.collecteAt
            }
            chrome.storage.local.set({ twitter_temp: temp })
        })
    }

})

// ── Utilitaires ──────────────────────────────────────────────────────
function getMoisActuel() {
    const now = new Date()
    const m   = String(now.getMonth() + 1).padStart(2, '0')
    return `${now.getFullYear()}-${m}`
    // → "2026-03"
}