// src/content_tiktok.js

setTimeout(() => {

    // ── Extraire le username depuis l'URL ────────────────────────
    const username = window.location.pathname.replace('/@', '').split('/')[0]
    console.log(`[SocialTracker] TikTok détecté : @${username}`)

    // ── Chercher le nombre d'abonnés dans le DOM ─────────────────
    const selecteurs = [
        '[data-e2e="followers-count"]',
        '[data-e2e="follower-count"]',
        'strong[data-e2e*="follower"]'
    ]

    let abonnes = null

    for (const selecteur of selecteurs) {
        const element = document.querySelector(selecteur)

        if (element) {
            const texte = element.textContent.trim()
            abonnes = convertirNombre(texte)
            console.log(`[SocialTracker] Trouvé avec : "${selecteur}" → "${texte}" → ${abonnes}`)
            break
        }
    }

    if (!abonnes) {
        console.log('[SocialTracker] TikTok : abonnés introuvables')
        return
    }

    // ── Envoyer les données à background.js ──────────────────────
    chrome.runtime.sendMessage({
        type:       'TIKTOK_DATA',
        username:   username,
        abonnes:    abonnes,
        collecteAt: new Date().toISOString()
    })

}, 3000)


// ── Convertir "25.6K" → 25600 ────────────────────────────────────────
function convertirNombre(texte) {
    const t = texte.trim().toUpperCase()

    if (t.includes('M')) {
        return Math.round(parseFloat(t) * 1_000_000)
    }
    if (t.includes('K')) {
        return Math.round(parseFloat(t) * 1_000)
    }
    return parseInt(t.replace(/[^0-9]/g, '')) || null
}