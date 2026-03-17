async function getidPage(nomPage, token){
    const urlRecherche = `https://api.linkedin.com/v2/organizations?q=vanityName&vanityName=${nomPage}`

    const reponseRecherche = await fetch(urlRecherche, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Restli-Protocol-Version': '2.0.0'
        }
    })

    if (!reponseRecherche.ok) {
        throw new Error(`LinkedIn erreur HTTP : ${reponseRecherche.status}`)
    }

    const dataRecherche = await reponseRecherche.json()
    console.log("LinkedIn dataRecherche:", dataRecherche)

    // Extraire l'ID
    const orgId = dataRecherche.elements?.[0]?.id

    if (!orgId) {
        throw new Error(`LinkedIn : page "${nomPage}" introuvable`)
    }
    return orgId
}

async function getFollowersLinkedIn(orgId, token) {
    const urlFollowers = `https://api.linkedin.com/v2/organizationFollowerStatistics?q=organizationalEntity&organizationalEntity=urn:li:organization:${orgId}`

    const reponseFollowers = await fetch(urlFollowers, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Restli-Protocol-Version': '2.0.0'
        }
    })
    if (!reponseFollowers.ok)
        throw new Error(`LinkedIn followers erreur HTTP : ${reponseFollowers.status}`)
    const data = await reponseFollowers.json()
    return data
}

export async function getLinkedinAbonnes(nomPage, token) {

    try {
        const orgId = await getidPage(nomPage, token)

        const dataFollowers = await getFollowersLinkedIn(orgId, token)

        // Extraire le total des followers
        const totalFollowers = dataFollowers.elements?.[0]?.followerCountsByAssociationType
            ?.find(f => f.associationType === 'MEMBER')
            ?.followerCounts?.organicFollowerCount ?? null

        // ── Étape 3 : Retourner les données ─────────────────────────
        return {
            nom:        nomPage,
            abonnes:    totalFollowers,
            plateforme: "linkedin"
        }
    } catch (error) {
        console.error(`Erreur fetchLinkedIn pour "${nomPage}" :`, error)
        throw error
    }
}