# How to run the app?
## Setup MongoDB
REST API is using MongoDB to store data, so you need installed one. You can run it on Docker container as well.
Here's endpoints to create new products and categories, but here's no interface. So you need to load database dump from `dump` directory using `mongorestore --uri="<your MongoDB URI>" dump`.
## Configure and run API
First of all, you need to configure Express server. Use json files in `api/src/configs` directory:
- In `app.json` specify port to run server on, front-end origin and set `README_confirmation` to `true`.
- In `db.json` provide address, port and name of your database. Make sure to disable auth in MongoDB security settings.
- In `crypto.json` paste long random key to encrypt and decrypt JWTs.

Next, from `api` folder run `npm run start` and wait for server initialization.
## React App
- In `frontend/src/api.json` paste URL of your Express server.
- Use `npm start` to run app in developer mode.