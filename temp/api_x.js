import {tripName} from "./api_tiktok"

async function getData(username, token){
    const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics,name`

    const reponse = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!reponse.ok)
        throw new Error(`Twitter erreur HTTP : ${reponse.status}`)

    const data = await reponse.json()
    if (data.errors)
        throw new Error(`Twitter API erreur : ${data.errors[0].message}`)
    return (data.data)
}

export async function getXAbonnes(nomPage, token) {

    try {
        const username = tripName(nomPage)
    
        const user = await getData(username, token)
    
        return {
            nom:        nomPage,
            abonnes:    user.public_metrics?.followers_count ?? null,
            plateforme: "twitter"
        }
    }catch (e) {
        console.error(`Erreur fetchX pour "${nomPage}" :`, e)
        throw e
    }
}
