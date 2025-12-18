# credit-scoring-app

![Dashboard screenshot](./dashboard.jpg)

DEFAULT RISK PREDICTION APPLICATION FOR MICROFINANCE INSTITUTIONS.

## Lancer et tester l'application (Fullstack)

Prérequis : Python 3.8+, Node.js (16+ recommandé), npm ou yarn, git.

Remarque : le projet contient trois parties distinctes : l'API (backend, FastAPI), l'interface React (dossier `frontend`) et l'application Streamlit (`app.py`). En développement, on lance chaque partie dans un terminal séparé.

1. Cloner le dépôt

```powershell
git clone https://github.com/Chret237/credit-scoring-app.git
```

2. Accéder au dossier du projet

```powershell
cd credit-scoring-app
```

3. (Recommandé) créer et activer un environnement virtuel Python

- Windows (PowerShell) :

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

- macOS / Linux :

```bash
python -m venv .venv
source .venv/bin/activate
```

4. Installer les dépendances Python

```powershell
pip install -r requirements.txt
```

5. Lancer l'API (FastAPI / Uvicorn)

Ouvrez un terminal (avec l'environnement virtuel activé) et lancez :

```powershell
uvicorn src.api:app --reload --host 127.0.0.1 --port 8000
```

L'API sera accessible par défaut sur `http://127.0.0.1:8000`.

6. Lancer le frontend React (Vite)

Ouvrez un second terminal puis :

```powershell
cd frontend
npm install
npm run dev
```

Le serveur de développement Vite démarre normalement sur `http://localhost:5173` (port affiché dans la console). Pour une build de production :

```powershell
npm run build
npm run preview
```

7. Lancer l'application Streamlit

Ouvrez un troisième terminal (à la racine du projet, environnement virtuel activé) et lancez :

```powershell
streamlit run app.py
```

Streamlit s'exécutera par défaut sur `http://localhost:8501`.

8. Scénarios de développement courants

- Développement complet (API + frontend React): lancez l'API (`uvicorn`) et le frontend (`npm run dev`) ; le frontend communiquera avec l'API sur `127.0.0.1:8000` si nécessaire.
- Tester l'interface utilisateur Streamlit : lancez `streamlit run app.py` ; Streamlit utilise ses propres composants et peut aussi appeler l'API locale.

9. Accès

- API : `http://127.0.0.1:8000`
- Frontend (Vite) : `http://localhost:5173`
- Streamlit : `http://localhost:8501`

10. Dépannage rapide

- Assurez-vous que Python, Node.js et npm sont installés et dans le PATH.
- Si le port est occupé, changez le port dans la commande (ex. `--port 8001` pour Uvicorn) ou fermez l'application qui utilise le port.
- Pour Windows PowerShell, si l'activation du venv échoue : exécutez `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` puis relancez `.venv\\Scripts\\Activate.ps1`.
- 
