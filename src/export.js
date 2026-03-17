
function createData(entite, entitePrec, snapshot, lines){
    const fb  = entite.facebook?.abonnes  ?? null
            const ig  = entite.instagram?.abonnes ?? null
            const li  = entite.linkedin?.abonnes  ?? null
            const yt  = entite.youtube?.abonnes   ?? null
            const tk  = entite.tiktok?.abonnes    ?? null
            const tw  = entite.twitter?.abonnes   ?? null

            const fbP = entitePrec?.facebook?.abonnes  ?? null
            const igP = entitePrec?.instagram?.abonnes ?? null
            const liP = entitePrec?.linkedin?.abonnes  ?? null
            const ytP = entitePrec?.youtube?.abonnes   ?? null
            const tkP = entitePrec?.tiktok?.abonnes    ?? null
            const twP = entitePrec?.twitter?.abonnes   ?? null

            lines.push({
                "Mois":                mois,
                "Pays":                entite.pays,
                "Pôle":                entite.pole,
                "Société":             entite.entité,
                "Ville":               entite.ville,
                "Facebook":            fb ?? "",
                "Évolution Facebook":  evo(fb, fbP),
                "Instagram":           ig ?? "",
                "Évolution Instagram": evo(ig, igP),
                "LinkedIn":            li ?? "",
                "Évolution LinkedIn":  evo(li, liP),
                "YouTube":             yt ?? "",
                "Évolution YouTube":   evo(yt, ytP),
                "TikTok":              tk ?? "",
                "Évolution TikTok":    evo(tk, tkP),
                "Twitter":             tw ?? "",
                "Évolution Twitter":   evo(tw, twP),
                "Collecté le":         snapshot.collecteAt
                    ? new Date(snapshot.collecteAt).toLocaleDateString('fr-FR')
                    : ""
            })
}

// function downloadfile(blob, nomFichier) {
//     const url = URL.createObjectURL(blob)
//     const a   = document.createElement('a')
//     a.href     = url
//     a.download = nomFichier
//     a.click()
//     URL.revokeObjectURL(url)
// }

function getTime() {
    return new Date().toISOString().slice(0, 10)
}

function aplatirDonnees(snapshots) {
    const lines = []
    const moisTries = Object.keys(snapshots).sort()

    for (let i = 0; i < moisTries.length; i++) {
        const mois     = moisTries[i]
        const moisPrec = i > 0 ? moisTries[i - 1] : null
        const snapshot = snapshots[mois]

        for (const entite of snapshot.resultats) {

            // Trouver la même société dans le mois précédent
            const entitePrec = moisPrec
                ? snapshots[moisPrec].resultats.find(
                    e => e.societe === entite.entité && e.pays === entite.pays
                )
                : null

            // Calculer l'évolution pour chaque plateforme
            const evo = (actuel, precedent) => {
                if (!precedent || actuel === null || precedent === null) return ""
                const diff = actuel - precedent
                return diff >= 0 ? `+${diff}` : `${diff}`
            }

            createData(entite, entitePrec, snapshot, lines)
        }
    }
    return lines
}

export function exportExcel(snapshots) {
    const lignes = aplatirDonnees(snapshots)

    if (!lignes.length) {
        alert('Aucune donnée à exporter.')
        return
    }

    // SheetJS doit être chargé dans popup.html
    if (typeof XLSX === 'undefined') {
        alert('Erreur : SheetJS non chargé.')
        return
    }
    // Créer le fichier Excel
    const wb = XLSX.utils.book_new()
    // Onglet 1 — toutes les données
    const ws = XLSX.utils.json_to_sheet(lignes)
    XLSX.utils.book_append_sheet(wb, ws, 'Toutes les données')

    // Onglet 2 — un onglet par pays
    const pays = [...new Set(lignes.map(l => l['Pays']))]
    for (const p of pays) {
        const lignesPays = lignes.filter(l => l['Pays'] === p)
        const wsPays = XLSX.utils.json_to_sheet(lignesPays)
        XLSX.utils.book_append_sheet(wb, wsPays, p.substring(0, 31))
    }

    // Télécharger le fichier
    XLSX.writeFile(wb, `social_tracker_${getTime()}.xlsx`)
}

// export function exportCSV(snapshots) {
//     const lignes = aplatirDonnees(snapshots)

//     if (!lignes.length) {
//         alert('Aucune donnée à exporter.')
//         return
//     }

//     // Créer les en-têtes
//     const headers = Object.keys(lignes[0])

//     // Créer les lignes CSV
//     const csvLignes = [
//         headers.join(';'),
//         ...lignes.map(ligne =>
//             headers.map(h =>
//                 `"${String(ligne[h] ?? '').replace(/"/g, '""')}"`
//             ).join(';')
//         )
//     ]

//     // Télécharger le fichier
//     const blob = new Blob(
//         ['\uFEFF' + csvLignes.join('\r\n')],
//         //  ↑
//         // BOM UTF-8 — pour que Excel affiche bien les accents
//         { type: 'text/csv;charset=utf-8;' }
//     )

//     telecharger(blob, `social_tracker_${aujourdhui()}.csv`)
// }