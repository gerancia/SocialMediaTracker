// src/content_instagram.js

setTimeout(() => {

    // ── Extraire le username depuis l'URL ────────────────────────
    const username = window.location.pathname.replace(/\//g, '')
    console.log(`[SocialTracker] Instagram détecté : @${username}`)

    // ── Chercher le nombre d'abonnés dans le DOM ─────────────────
    const selecteurs = [
        'a[href*="followers"] span span',
        'a[href*="followers"] span',
        'span[title]',
        'li span span'
    ]

    let abonnes = null

    for (const selecteur of selecteurs) {
        const elements = document.querySelectorAll(selecteur)

        for (const el of elements) {
            // Instagram met le vrai nombre dans l'attribut title
            // ex: title="25 600" au lieu de "25.6K" affiché
            const titre = el.getAttribute('title')
            const texte = el.textContent.trim()

            if (titre && titre.match(/[\d\s,]+/)) {
                abonnes = parseInt(titre.replace(/[^0-9]/g, ''))
                console.log(`[SocialTracker] Trouvé via title : "${titre}" → ${abonnes}`)
                break
            }

            if (texte.match(/[\d,.]+\s*(K|M|k|m)?/) && texte.length < 15) {
                abonnes = convertirNombre(texte)
                console.log(`[SocialTracker] Trouvé via texte : "${texte}" → ${abonnes}`)
                break
            }
        }

        if (abonnes) break
    }

    if (!abonnes) {
        console.log('[SocialTracker] Instagram : abonnés introuvables')
        return
    }

    // ── Envoyer les données à background.js ──────────────────────
    chrome.runtime.sendMessage({
        type:       'INSTAGRAM_DATA',
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