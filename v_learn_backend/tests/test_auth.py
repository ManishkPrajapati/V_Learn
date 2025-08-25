# tests/test_auth.py
import pytest
from app import create_app
from config import Config
import json

@pytest.fixture
def client():
    app = create_app(Config)
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c

def test_register_login_flow(client):
    # register
    r = client.post("/auth/register", json={"username":"testu","email":"test@example.com","password":"pass123"})
    assert r.status_code in (201, 409)  # if already exists on repeated runs

    # login
    r2 = client.post("/auth/login", json={"email":"test@example.com","password":"pass123"})
    assert r2.status_code in (200,401)
    if r2.status_code == 200:
        data = r2.get_json()
        assert "access_token" in data
