# Build step #1: build the React front end
FROM node:16-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY frontend/package.json frontend/yarn.lock frontend/postcss.config.js frontend/tailwind.config.js frontend/tsconfig.json ./
COPY frontend/src ./src
COPY frontend/public ./public
RUN yarn install
RUN yarn build

# Build step #2: build the API with the client as static files
FROM python:3.9
WORKDIR /app

COPY ./requirements.txt ./.flaskenv ./db.py ./wsgi.py ./app.py ./.env ./
COPY backend ./backend
COPY --from=build-step /app/build ./frontend/build

# RUN mkdir ./api
# COPY requirements.txt app.py .flaskenv db.py ./api
RUN pip install -r requirements.txt

EXPOSE 5000
ENV FLASK_DEBUG=1
# WORKDIR /app/api
CMD ["gunicorn", "-b", ":5000", "--threads=2", "wsgi:app"]