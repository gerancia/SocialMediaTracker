// src/content_facebook.js

setTimeout(() => {

    // ── Extraire le nom de la page depuis l'URL ──────────────────
    const nomPage = window.location.pathname.replace('/', '').split('/')[0]
    console.log(`[SocialTracker] Facebook détecté : ${nomPage}`)

    // ── Chercher le nombre d'abonnés dans le DOM ─────────────────
    const selecteurs = [
        'a[href*="followers"] span',
        'div[data-key="tab_home"] span',
        'span[dir="auto"]'
    ]

    let abonnes = null

    for (const selecteur of selecteurs) {
        const elements = document.querySelectorAll(selecteur)

        for (const el of elements) {
            const texte = el.textContent.trim()

            // Chercher un texte qui ressemble à un nombre d'abonnés
            if (texte.match(/[\d,.]+\s*(K|M|k|m)?\s*(followers|abonnés|J'aime|likes)/i)) {
                abonnes = convertirNombre(texte)
                console.log(`[SocialTracker] Trouvé : "${texte}" → ${abonnes}`)
                break
            }
        }

        if (abonnes) break
    }

    if (!abonnes) {
        console.log('[SocialTracker] Facebook : abonnés introuvables')
        return
    }

    // ── Envoyer les données à background.js ──────────────────────
    chrome.runtime.sendMessage({
        type:       'FACEBOOK_DATA',
        nomPage:    nomPage,
        abonnes:    abonnes,
        collecteAt: new Date().toISOString()
    })

}, 3000)


// ── Convertir "25.6K" ou "25 600 abonnés" → 25600 ───────────────────
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