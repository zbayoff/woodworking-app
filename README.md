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
yarn start

Prod:
yarn build
yarn start

Docker:
build:
docker build -f Dockerfile -t react-flask-app .

run:
docker run --rm -p 5000:5000 react-flask-app 

run in bash:
docker run -it image_name sh

list images:
docker image ls


exit