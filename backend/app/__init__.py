from flask import Flask
from app.routes.notes import notes_bp


def create_app():
    app = Flask(__name__)

    app.register_blueprint(notes_bp, url_prefix="/api")

    @app.route("/health", methods=["GET"])
    def health():
        return {"status": "healthy"}, 200

    return app