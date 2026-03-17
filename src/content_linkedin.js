// src/content_linkedin.js

setTimeout(() => {

    // ── Extraire le nom de la page depuis l'URL ──────────────────
    // URL : linkedin.com/company/fondation-axian
    const nomPage = window.location.pathname
        .replace('/company/', '')
        .split('/')[0]

    console.log(`[SocialTracker] LinkedIn détecté : ${nomPage}`)

    // ── Chercher le nombre d'abonnés dans le DOM ─────────────────
    const selecteurs = [
        'p.org-top-card-summary-info-list__info-item',
        '.org-top-card-summary__info-item',
        'p[data-anonymize="person-blurb"]',
        '.org-top-card__primary-content p'
    ]

    let abonnes = null

    for (const selecteur of selecteurs) {
        const elements = document.querySelectorAll(selecteur)

        for (const el of elements) {
            const texte = el.textContent.trim()

            // LinkedIn affiche "25 600 abonnés" ou "25,600 followers"
            if (texte.match(/[\d\s,.]+\s*(abonnés|followers|suiveurs)/i)) {
                abonnes = convertirNombre(texte)
                console.log(`[SocialTracker] Trouvé : "${texte}" → ${abonnes}`)
                break
            }
        }

        if (abonnes) break
    }

    if (!abonnes) {
        console.log('[SocialTracker] LinkedIn : abonnés introuvables')
        return
    }

    // ── Envoyer les données à background.js ──────────────────────
    if (chrome.runtime?.id)
    {
        chrome.runtime.sendMessage({
            type:       'LINKEDIN_DATA',
            nomPage:    nomPage,
            abonnes:    abonnes,
            collecteAt: new Date().toISOString()
        })
    }
    else{
        console.warn('[SocialTracker] Extension deconnecte')
    }

}, 3000)


// ── Convertir "25 600 abonnés" → 25600 ──────────────────────────────
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