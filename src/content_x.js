// src/content_twitter.js

setTimeout(() => {

    // ── Extraire le username depuis l'URL ────────────────────────
    const username = window.location.pathname.replace('/', '').split('/')[0]
    console.log(`[SocialTracker] Twitter détecté : @${username}`)

    // ── Chercher le nombre d'abonnés dans le DOM ─────────────────
    const selecteurs = [
        'a[href*="followers"] span span',
        'a[href*="verified_followers"] span span',
        '[data-testid="UserProfileHeader_Items"] span'
    ]

    let abonnes = null

    for (const selecteur of selecteurs) {
        const elements = document.querySelectorAll(selecteur)

        for (const el of elements) {
            const texte = el.textContent.trim()

            // Chercher un texte qui ressemble à un nombre
            if (texte.match(/^[\d,.]+\s*(K|M|k|m)?$/)) {
                abonnes = convertirNombre(texte)
                console.log(`[SocialTracker] Trouvé : "${texte}" → ${abonnes}`)
                break
            }
        }

        if (abonnes) break
    }

    if (!abonnes) {
        console.log('[SocialTracker] Twitter : abonnés introuvables')
        return
    }

    // ── Envoyer les données à background.js ──────────────────────
    chrome.runtime.sendMessage({
        type:       'TWITTER_DATA',
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