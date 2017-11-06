# Tailor

Adaptive course authoring platform.

## :blue_book: Dependencies
* Node.js (>= 8.8.0)
* npm (>= 5.4.2)
* PostgreSQL (>= 9.6)

## :coffee: Installation

### Prerequisites
* Node.js & npm: https://nodejs.org/en/download/
* PostgreSQL: https://www.postgresql.org/download/
* Clone this repo

### Setup
* Run `npm install` in the repo directory
* Create database in PostgreSQL
* App is configured via environment variables contained in a file named `.env`.
Use the `.env.example` file as a template: `cp .env.example .env` and enter
configuration details.
* You can init the db (for development) by running `npm run db:seed`
* You can create admin user by running `npm run add:admin <email> <password>`
* App branding is configured via values set in a file named `.brand-rc.json`.
Use the `.brand-rc.example.json` file as a template: `cp .brand-rc.example.json .brand-rc.json` and enter
configuration details.

## :rocket: Launch

### Development
* Server: `npm run dev:server`
* Client (webpack dev server): `npm run dev:client`

### Production
* Bundle client by issuing `npm run build`
* `npm run start`
