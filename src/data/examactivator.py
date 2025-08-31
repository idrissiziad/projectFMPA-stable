import json

def reorder_question_json(original_question):
    """
    Réorganise les clés d'UN SEUL dictionnaire de question JSON
    selon un nouvel ordre prédéfini.

    Args:
        original_question (dict): Le dictionnaire Python d'une question.

    Returns:
        dict: Un nouveau dictionnaire avec les clés dans le bon ordre.
    """
    if not isinstance(original_question, dict):
        return original_question # Retourne l'élément tel quel s'il n'est pas un dictionnaire

    reordered_question = {}
    
    # Ordre souhaité pour chaque choix
    choices = ['A', 'B', 'C', 'D', 'E']
    for letter in choices:
        for suffix in ['Explanation', 'Text', 'isCorrect']:
            key = f"Choice_{letter}_{suffix}"
            if key in original_question:
                reordered_question[key] = original_question[key]

    # Ordre souhaité pour les clés générales
    general_keys = [
        "OverallExplanation",
        "QuestionText",
        "Subtopic",
        "YearAsked"
    ]
    for key in general_keys:
        if key in original_question:
            reordered_question[key] = original_question[key]
    
    return reordered_question

# --- Programme Principal ---

# Noms des fichiers
input_filename = "Sémiologie Cardiovasculaire (Novembre 2024).json"
output_filename = "reordered.json"

try:
    # 1. Lire le fichier d'entrée contenant la LISTE de questions
    with open(input_filename, 'r', encoding='utf-8') as f:
        list_of_questions = json.load(f)

    # Vérifier que le fichier contient bien une liste
    if not isinstance(list_of_questions, list):
        print(f"Erreur : Le fichier '{input_filename}' ne contient pas une liste JSON (commençant par '[').")
    else:
        # 2. Créer une nouvelle liste pour stocker les résultats
        reordered_list = []
        
        # 3. Parcourir chaque question dans la liste d'origine
        for question in list_of_questions:
            # Appliquer la fonction de réorganisation à chaque question
            reordered_q = reorder_question_json(question)
            reordered_list.append(reordered_q)

        # 4. Écrire la NOUVELLE LISTE dans le fichier de sortie
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(reordered_list, f, indent=2, ensure_ascii=False)
        
        print(f"Succès ! {len(reordered_list)} questions ont été réorganisées.")
        print(f"Le résultat a été sauvegardé dans '{output_filename}'.")

except FileNotFoundError:
    print(f"Erreur : Le fichier d'entrée '{input_filename}' est introuvable.")
    print("Veuillez vous assurer qu'il se trouve dans le même dossier que le script.")
except json.JSONDecodeError:
    print(f"Erreur : Le contenu du fichier '{input_filename}' n'est pas un JSON valide.")
except Exception as e:
    print(f"Une erreur inattendue est survenue : {e}")
