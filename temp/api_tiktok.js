
export function tripName(nomPage) {
    if (nomPage.startsWith('@'))
        return (nomPage.slice(1))
    return (nomPage)
}

async function getTiktokPage(username){
    const url = `https://www.tiktok.com/@${username}`

    const reponse = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    })
    if (!reponse.ok)
        throw new Error(`TikTok erreur HTTP : ${reponse.status}`)
    const html = await reponse.text()
    return (html)
}

function getFOllowersNumber(match){
    const data = JSON.parse(match[1])

    const userInfo = data?.UserPage?.userInfo?.stats
                    || data?.itemInfo?.authorStats
                    || null

    if (!userInfo)
        throw new Error(`TikTok : structure de données inconnue pour "${nomPage}"`)

    return {
        nom:        nomPage,
        abonnes:    userInfo.followerCount ?? null,
        plateforme: "tiktok"
    }
}

export async function fetchTiktok(nomPage) {

    try {
        // ── Étape 1 : Charger la page TikTok ─────────────────────────
        const username = tripName(nomPage)
    
        const html = await getTiktokPage(username)

        // ── Étape 2 : Extraire les données du HTML ───────────────────
        const regex = new RegExp('<script id="SIGI_STATE" type="application/json">(.*?)</script>')
        const match = html.match(regex)
    
        if (!match)
            throw new Error(`TikTok : données introuvables pour "${nomPage}"`)
        return (getFOllowersNumber(match))
        
    }
    catch (e){
        console.error(`Erreur fetchTiktok pour "${nomPage}" :`, e)
        throw e
    }
}