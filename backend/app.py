import os
from dotenv import load_dotenv
from flask import Flask

from db import db, ma
from controllers.posts import POSTS_API
from controllers.categories import CATEGORIES_API


def create_app():

    load_dotenv()

    app = Flask(__name__)

    url = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_DATABASE_URI"] = url

    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        # db.drop_all()

        db.create_all()
        app.register_blueprint(POSTS_API)
        app.register_blueprint(CATEGORIES_API)

    return app


if __name__ == "__main__":
    create_app()
