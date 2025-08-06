import sys
import json
import re
import time
import random
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
from pathlib import Path

SESSIONS_DIR = Path("sessions")
SESSIONS_DIR.mkdir(exist_ok=True)

def random_delay(min_seconds=10, max_seconds=20):
    """Чекає випадковий проміжок часу."""
    print(f"INFO: Пауза на {min_seconds}-{max_seconds} секунд...")
    time.sleep(random.uniform(min_seconds, max_seconds))

def login_facebook(login, password):
    """
    Виконує вхід у Facebook і перевіряє успішність,
    намагаючись перейти на сторінку /me.
    """
    cookie_path = SESSIONS_DIR / f"{login}_cookies.json"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=["--disable-notifications"]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 800},
            locale="uk-UA"
        )
        page = context.new_page()

        try:
            print("INFO: Перехід на сторінку Facebook...")
            page.goto("https://www.facebook.com/", wait_until="domcontentloaded", timeout=60000)

            accept_button_locator = page.get_by_role(
                'button', name=re.compile('Allow all cookies|Дозволити всі файли cookie', re.IGNORECASE)
            ).or_(
                page.locator("[data-testid='cookie-policy-manage-dialog-accept-button']")
            )
            try:
                accept_button_locator.click(timeout=7000)
                print("SUCCESS: Кнопка cookie натиснута.")
            except PlaywrightTimeoutError:
                print("WARN: Діалог про cookie не з'явився.")

            random_delay()

            print("INFO: Введення логіну та паролю...")
            page.locator("#email").fill(login)
            random_delay()
            page.locator("#pass").fill(password)
            random_delay()
            
            print("INFO: Натискання кнопки 'Увійти'...")
            page.locator("button[name='login']").click()
            
            # Робимо коротку паузу, щоб дати Facebook час на початковий редирект
            print("INFO: Коротка пауза після кліку...")
            time.sleep(5)
            
            print("INFO: Перевірка статусу через перехід на /me...")
            
            # Намагаємося перейти на сторінку /me, яка вимагає авторизації
            page.goto("https://www.facebook.com/me/", wait_until="domcontentloaded", timeout=30000)
            final_url = page.url.lower()
            print(f"INFO: Фінальна URL-адреса: {final_url}")

            # Успішний вхід, якщо URL не містить слів 'login' або 'checkpoint'
            if "login" not in final_url and "checkpoint" not in final_url:
                print("SUCCESS: Вхід успішний (доступ до /me отримано). Збереження сесії...")
                cookies = context.cookies()
                with open(cookie_path, 'w') as f:
                    json.dump(cookies, f)
                return {"status": "success", "message": "Вхід виконано успішно", "cookie_path": str(cookie_path)}
            
            elif "checkpoint" in final_url:
                print("ERROR: Акаунт потребує перевірки (checkpoint).")
                return {"status": "error", "message": "Акаунт потребує перевірки (checkpoint)"}
            
            else: # Якщо перенаправило на сторінку входу
                print("ERROR: Неправильний пароль (перенаправлено на сторінку входу).")
                return {"status": "error", "message": "Неправильний пароль або інша помилка входу."}

        except Exception as e:
            print(f"FATAL: Неочікувана помилка в Playwright: {e}")
            return {"status": "error", "message": f"Виникла неочікувана помилка: {str(e)}"}
        finally:
            if browser.is_connected():
                browser.close()

if __name__ == "__main__":
    result_data = {}
    try:
        # --- ЗМІНЕНО: Спрощена логіка, оскільки є тільки одна дія ---
        if len(sys.argv) != 3:
            raise ValueError("Для входу потрібні логін та пароль")

        login_arg = sys.argv[1]
        password_arg = sys.argv[2]
        
        result_data = login_facebook(login_arg, password_arg)

    except Exception as e:
        result_data = {"status": "error", "message": f"Критична помилка виконання скрипта: {str(e)}"}
    finally:
        # --- ЗМІНЕНО: Назва тимчасового файлу ---
        result_file_path = SESSIONS_DIR / f"{sys.argv[1]}_temp_result.json"
        with open(result_file_path, 'w', encoding='utf-8') as f:
            json.dump(result_data, f, ensure_ascii=False)
        print("INFO: Скрипт завершив роботу. Це вікно закриється через 10 секунд.")
        time.sleep(10)
