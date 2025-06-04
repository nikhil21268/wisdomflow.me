from app import create_app

def test_config():
    app = create_app()
    assert app.config['SECRET_KEY']
