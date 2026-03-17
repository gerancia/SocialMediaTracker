# import requests

# TOKEN = "EAAMy1XY3EGEBQZCctrO0Ti5CKRZClQTBOMqThnQdCK9eNDcWzDGkEEXXNdG4MxB8jIAu4ypL8LZAc6GSLytQg79vSBoAtvU5ID3F5npNoGY5J3fhobUZAd79zgZBeN49xoeszvoD8ak4Oe3FAZBLhTd56dQ9KZCu7fAWHYZAAEZAmdCqRWROG8KGy1GjVwYpbQVsRGPhqd0mrtljQvrk6yNH7kuxvhZAevolcvEAXQZCn0fCJzIiOZBPaMx9ZAIU6B20rSZAXEh2JPZAjvllfmDJUG3PXiwGHRHRLOWkUP3GL1T2RKiC34C9GB39mRKleCtg3E6tfTNelAEDzMi"
# NOM_PAGE = "YasMadagasikara"

# url = f"https://graph.facebook.com/v19.0/{NOM_PAGE}?fields=name,fan_count&access_token={TOKEN}"

# reponse = requests.get(url)
# print("Status :", reponse.status_code)
# print(reponse.json())

# import requests

# TOKEN = "AAAAAAAAAAAAAAAAAAAAAAH38AEAAAAAf12xaaz0IBDlnWF55zNgkmomf58%3D8ACe3AuU2n9JL9cvpQvP0R6Ka7JbTQUHupgkeKj8RIvRt7U0Mf"
# USERNAME = "AxianGroup"

# url = f"https://api.twitter.com/2/users/by/username/{USERNAME}?user.fields=public_metrics,name"

# headers = {
#     "Authorization": f"Bearer {TOKEN}"
# }

# reponse = requests.get(url, headers=headers)
# print("Status :", reponse.status_code)
# print(reponse.json())

import requests
import re

USERNAME = "AxianGroup"
url = f"https://twitter.com/{USERNAME}"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

reponse = requests.get(url, headers=headers)

# Chercher followers dans le HTML
matches = re.findall(r'.{50}follower.{50}', reponse.text, re.IGNORECASE)
print(f"Occurrences de 'follower' : {len(matches)}")
for m in matches[:5]:
    print(m)