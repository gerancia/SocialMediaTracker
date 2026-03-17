
async function getID(nomPage, token){
     // ── Étape 1 : Trouver l'ID Instagram via Facebook Graph ──────
    const urlPage = `https://graph.facebook.com/v19.0/${nomPage}?fields=instagram_business_account&access_token=${token}`

    const reponsePage = await fetch(urlPage)
    if (!reponsePage.ok)
        throw new Error(`Instagram erreur HTTP : ${reponsePage.status}`)

    const dataPage = await reponsePage.json()
    if (dataPage.error)
        throw new Error(`Instagram API erreur : ${dataPage.error.message}`)

    // Extraire l'ID Instagram Business
    const igId = dataPage?.instagram_business_account?.id

    if (!igId)
        throw new Error(`Instagram : compte Business introuvable pour "${nomPage}"`)
    return (igId)
}

async function getFollowersNumber(igId, token){
    // ── Étape 2 : Récupérer les abonnés avec l'ID Instagram ──────
    const urlStats = `https://graph.instagram.com/v19.0/${igId}?fields=name,username,followers_count,media_count&access_token=${token}`

    const reponseStats = await fetch(urlStats)
    if (!reponseStats.ok)
        throw new Error(`Instagram stats erreur HTTP : ${reponseStats.status}`)

    const dataStats = await reponseStats.json()
    if (dataStats.error)
        throw new Error(`Instagram stats erreur : ${dataStats.error.message}`)
    return (dataStats)
}

export async function fetchInstagram(nomPage, token) {

   
    try{
        const igId = await getID(nomPage, token)
        const data = await getFollowersNumber(igId, token)
        return {
        nom:    nomPage,
        abonnes:    data.followers_count ?? null,
        plateforme: "instagram"
    }
    }catch (e){
        console.error(`Erreur fetchLinkedIn pour "${nomPage}" :`, e)
        throw e
    }
}
