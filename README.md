
# Automated Resume Analysis Job Recommendation

## Core Intelligence: Job Recommendation Engine

The system features an advanced matching engine that compares resumes against job descriptions using Natural Language Processing (NLP):

* **Skill Extraction**: Utilizes **SpaCy** for Named Entity Recognition (NER) to identify technical skills, certifications, and experience levels from raw text.
* **Semantic Similarity**: Implements **RoBERTa** (Robustly Optimized BERT Approach) to understand the context of a resume. It doesn't just look for keywords; it understands the *meaning* behind professional experience.
* **Scoring System**: Calculates a compatibility score by embedding text into high-dimensional vectors and measuring the distance between candidate profiles and job requirements.


This project provides a **unified development CLI** to manage the frontend, backend, and related dependencies for the Mariwasa project. Instead of opening multiple terminals, you can use the provided automation scripts.

## 🛠 System Tech Stack

The Mariwasa project is built using modern technologies:

* **Frontend**: React.js & Tailwind CSS
* **Backend**: FastAPI (Python) & Swagger (OpenAPI)
* **Database**: PostgreSQL & Supabase (Auth/Storage/DB)
* **Dev Ops**: Custom Bash/PowerShell CLI Orchestrator, Docker

### System Architecture

The CLI acts as an orchestrator to launch and sync your development environment:

```text
       +---------------------------------------+
       |       Mariwasa Smart Dev CLI          |
       |     (start.sh  /  start.ps1)          |
       +---------------------------------------+
                |              |
      __________V__________    |    __________V__________
     |                     |   |   |                     |
     |   Frontend (Vite)   |<--+-->|   Backend (FastAPI) |
     |   Port: 5173        |       |   Port: 8000        |
     |_____________________|       |_____________________|
                                              |
                                     _________V_________
                                    |                   |
                                    |   pgAdmin / DB    |
                                    |   Port: 5050      |
                                    |___________________|
```

### Linux / macOS

* Git: ```sudo apt install git```
* Python 3.10+: ```sudo apt install python3 python3-venv```
* Node.js & npm: ```sudo apt install nodejs npm```
* Terminal: ```gnome-terminal (or compatible)```

### Windows

* Git: [Download here](https://git-scm.com)
* Python 3.10+: [Download here](https://www.python.org)
* Node.js: [Download here](https://nodejs.org)
* PowerShell 7+: Recommended for the best experience.

### 1. Linux / macOS (Bash)
* Open your terminal in the project root.
* Give execution permission to the script:
```bash
chmod +x start.sh
```

* Run the CLI
```bash
./start.sh
```

### 2. Windows (PowerShell)
* Open PowerShell as Administrator.
* Enable script execution (if you haven't before):
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
* Run the CLI
```bash
./start.ps1
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.