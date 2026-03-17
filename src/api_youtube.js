
async function getDataPage(nomPage, token){
    // ── Étape 1 : Chercher la chaîne par nom ─────────────────────
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&forHandle=${nomPage}&key=${token}`

    const reponse = await fetch(url)

    if (!reponse.ok)
        throw new Error(`YouTube erreur HTTP : ${reponse.status}`)

    const data = await reponse.json()

    if (!data.items || data.items.length === 0)
        throw new Error(`YouTube : chaîne "${nomPage}" introuvable`)
    return (data.items[0])
}

export async function getYoutubeAbonnes(nomPage, token) {

    try {
        const chaine = await getDataPage(nomPage, token)

        return {
            nom:        nomPage,
            abonnes:    parseInt(chaine.statistics?.subscriberCount) ?? null,
            plateforme: "youtube"
        }
        
    } catch (e){
        console.error(`Erreur fetchYoutube pour "${nomPage}" :`, e)
        throw e
    }
}