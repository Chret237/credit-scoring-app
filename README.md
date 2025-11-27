# credit-scoring-app

DEFAULT RISK PREDICTION APPLICATION FOR MICROFINANCE INSTITUTIONS.

## Lancer et tester l'API

Prérequis : Python 3.8+, git.

1. Cloner le dépôt

```bash
git clone <https://github.com/Chret237/credit-scoring-app.git>
```

2 Accéder au dossier du projet

```bash
cd credit-scoring-app
```

3 (Recommandé) créer et activer un environnement virtuel

- Windows :

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

- macOS / Linux :

```bash
python -m venv .venv
source .venv/bin/activate
```

4 Installer les dépendances

```bash
pip install -r requirements.txt
```

5 Lancer l'API en mode développement

```bash
uvicorn src.api:app --reload
```

6 Ouvrir l'API dans le navigateur

- Accéder à : <http://127.0.0.1:8000/>
