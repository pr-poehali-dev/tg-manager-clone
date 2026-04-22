"""
Авторизация пользователей: регистрация, вход, получение профиля.
Action передаётся в теле запроса: {"action": "register"|"login"|"me"}
"""
import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p36734692_tg_manager_clone")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action") or (event.get("queryStringParameters") or {}).get("action", "")

    # --- REGISTER ---
    if action == "register":
        name = (body.get("name") or "").strip()
        username = (body.get("username") or "").strip().lower()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not all([name, username, email, password]):
            return _err(400, "Заполните все поля")
        if len(password) < 6:
            return _err(400, "Пароль должен быть не менее 6 символов")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username = %s OR email = %s", (username, email))
        if cur.fetchone():
            conn.close()
            return _err(409, "Пользователь с таким логином или email уже существует")

        pwd_hash = hash_password(password)
        token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, username, email, password_hash) VALUES (%s, %s, %s, %s) RETURNING id",
            (name, username, email, pwd_hash)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        session = f"{user_id}:{token}"
        return _ok({"token": session, "user": {"id": user_id, "name": name, "username": username, "email": email, "status": "На связи 🚀"}})

    # --- LOGIN ---
    if action == "login":
        login = (body.get("login") or "").strip().lower()
        password = body.get("password") or ""

        if not login or not password:
            return _err(400, "Введите логин и пароль")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, username, email, status FROM {SCHEMA}.users WHERE (username = %s OR email = %s) AND password_hash = %s",
            (login, login, hash_password(password))
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return _err(401, "Неверный логин или пароль")

        user_id, name, username, email, status = row
        token = secrets.token_hex(32)
        session = f"{user_id}:{token}"
        return _ok({"token": session, "user": {"id": user_id, "name": name, "username": username, "email": email, "status": status or "На связи 🚀"}})

    # --- ME ---
    if action == "me":
        session_id = (event.get("headers") or {}).get("x-session-id") or (event.get("headers") or {}).get("X-Session-Id") or body.get("token") or ""
        if not session_id or ":" not in session_id:
            return _err(401, "Не авторизован")
        try:
            user_id = int(session_id.split(":")[0])
        except Exception:
            return _err(401, "Неверный токен")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, name, username, email, status FROM {SCHEMA}.users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return _err(404, "Пользователь не найден")
        uid, name, username, email, status = row
        return _ok({"user": {"id": uid, "name": name, "username": username, "email": email, "status": status}})

    return _err(400, "Неизвестное действие")


def _ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}

def _err(code: int, message: str) -> dict:
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": message}, ensure_ascii=False)}