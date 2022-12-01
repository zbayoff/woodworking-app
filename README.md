BACKEND

Dev:
flask run

activate virtual env:
. venv/bin/activate

deactivate:
deactivate

install packages:
pip install -r requirements.txt

Prod:
gunicorn --bind 0.0.0.0:5000 wsgi:app

FRONTEND
Dev:
yarn dev

Prod:
yarn build
yarn start