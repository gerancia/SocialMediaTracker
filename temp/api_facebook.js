
export async function fetchFacebook(nomPage, token) {

    const urlRecherche = `https://graph.facebook.com/v19.0/${nomPage}?fields=id,name,followers_count,fan_count&access_token=${token}`

    const reponse = await fetch(urlRecherche)

    if (!reponse.ok) {
        throw new Error(`Facebook erreur HTTP : ${reponse.status}`)
    }

    const data = await reponse.json()

    if (data.error) {
        throw new Error(`Facebook API erreur : ${data.error.message}`)
    }

    return {
        nom:        nomPage,
        abonnes:    data.followers_count ?? data.fan_count ?? null,
        plateforme: "facebook"
    }
}