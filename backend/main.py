import sys
import json
import subprocess
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from pathlib import Path

app = FastAPI()

SESSIONS_DIR = Path("sessions")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AccountCredentials(BaseModel):
    login: str
    password: str

def run_auth_script(login: str, password: str) -> dict:
    """
    Запускає скрипт Playwright у новому вікні консолі
    і повертає результат з тимчасового файлу.
    """
    command = [
        sys.executable,
        "facebook_auth.py",
        login,
        password
    ]
    
    # --- ЗМІНЕНО: Назва тимчасового файлу ---
    result_file_path = SESSIONS_DIR / f"{login}_temp_result.json"
    
    creation_flags = subprocess.CREATE_NEW_CONSOLE if sys.platform == "win32" else 0
    
    process = subprocess.Popen(command, creationflags=creation_flags)
    process.wait()

    if result_file_path.exists():
        with open(result_file_path, 'r', encoding='utf-8') as f:
            result = json.load(f)
        os.remove(result_file_path)
        return result
    else:
        return {"status": "error", "message": "Не вдалося отримати результат від скрипта авторизації."}


@app.post("/api/login")
async def handle_login(credentials: AccountCredentials):
    """
    Викликає синхронну функцію запуску скрипта в окремому потоці.
    """
    print(f"Отримано запит на вхід для логіну: {credentials.login}")
    
    try:
        result = await run_in_threadpool(run_auth_script, credentials.login, credentials.password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Внутрішня помилка сервера: {e}")

    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result.get("message", "Невідома помилка"))
        
    return result

@app.get("/")
def read_root():
    return {"message": "HR Bot Backend працює!"}
