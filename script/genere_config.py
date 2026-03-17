import openpyxl
import json
import os

def read_config_from_excel(file_path):
    # Load the Excel workbook
    try:
        workbook = openpyxl.load_workbook(file_path)
    
    # Select the active sheet (you can specify a sheet name if needed)
        sheet = workbook.active
    
    # Initialize an empty list to hold the configuration
        config = []

    # Iterate through the rows in the sheet (starting from the second row to skip headers)
        for row in sheet.iter_rows(min_row=2, values_only=True):
            if not row[0]:
                break
            entite = {
                "pays": str(row[0]),
                "pole": str(row[1]),
                "entite": str(row[2]),
                "ville": str(row[3]),
                "facebook": str(row[4]).strip() if row[4] else "",
                "linkedin": str(row[5]).strip() if row[5] else "",
                "instagram": str(row[6]).strip() if row[6] else "",
                "youtube": str(row[7]).strip() if row[7] else "",
                "tiktok": str(row[8]).strip() if row[8] else "",
                "X": str(row[9]).strip() if row[9] else "",
                "actif": str(row[10]),
            }
            config.append(entite)

        # # print config for verification
        # print("Configuration lue depuis Excel :")
        # for entite in config:
        #     print(entite)
        
        
        return config
    except Exception as e:
        return []
    
def verifier(entites):
    print("\n── Vérification ────────────────────────────")
    
    plateformes = ["facebook", "instagram", "linkedin", "youtube", "tiktok", "X"]
    
    for entite in entites:
        manquants = []
        for p in plateformes:
            if not entite[p]:
                manquants.append(p)
        
        if manquants:
            print(f"⚠️  {entite['entite']} ({entite['pays']}) — manque : {', '.join(manquants)}")
        else:
            print(f"✅  {entite['entite']} ({entite['pays']}) — complet")
    
    print("────────────────────────────────────────────\n")



def contenu_to_json(config):

    conf_json = json.dumps(config, ensure_ascii=False, indent=4)
    contenu = f"""
    const CONFIG = {{
        entites: {conf_json},

        tokens: {{
            linkedin: "",
            youtube: "",
        }}
    }};
    """
    return contenu
    
def save_config(contenu):
    try:
        # verify if config.js exist
        if os.path.exists("config.js"):
            with open("config.js", "r", encoding="utf-8") as f:
                existing_content = f.read()
                print("ATOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
                if existing_content.strip() == contenu.strip():
                    print("⚠️ Le contenu de config.js est déjà à jour. Aucune modification n'a été apportée.")
                    return
        with open("config.js", "w", encoding="utf-8") as f:
            f.write(contenu)
        print("✅ Le fichier config.js a été mis à jour avec succès.")
        print("⚠️ N'oubliez pas de remplir les tokens d'API dans config.js avant de lancer l'extension.")
    except Exception as e:
        print(f"❌ Une erreur s'est produite lors de la mise à jour de config.js: {e}")

def main():
    filename = "data.xlsx"
    config_data = read_config_from_excel(filename)
    # verifier(config_data)
    if not config_data:
        print("❌ Aucune configuration n'a été trouvée dans le fichier Excel. Veuillez vérifier le fichier et réessayer.")
        return
    conf_json = contenu_to_json(config_data)
    save_config(conf_json)

if __name__ == "__main__":
    main()


