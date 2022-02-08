# Bachelor`s Thesis: „Golden Book” Bookstore - API

![Heroku](https://github.com/DenisOH/pyheroku-badge/blob/master/img/deployed.svg)

## How to use (local)

1. Clone this [repo](https://github.com/JusticeBringer/licenta-api) `git clone https://github.com/JusticeBringer/golden-book-bookstore-api.git`
2. Install required dependencies `npm i`
3. Start, in this order, `mongod` and `mongo` processes
4. Add a `.env` file with `NODE_ENV=development`
5. Add a `.env.development` and fill in the variables similar to the `.env.development.example` file
6. Run `npm run start_local`
7. Navigate to `http://localhost:3000` to see successful launch

Please note that this is the server of the web app [„Golden Book” Bookstore](https://github.com/JusticeBringer/licenta-api).

## Routes

Root path: `/api/v0`

- `'/catalog/books'`
- `'/payments/offline'`
- `'/orders'`
  - `'/'`
  - `/:id`
- `'/user'`
  - `'/register/confirmation/:token'`
  - `'/register/email'`
  - `'/register/google'`
  - `'/login/email'`
  - `'/login/google'`

Example of books route: [https://golden-book-bookstore-api.herokuapp.com/api/v0/catalog/books](https://golden-book-bookstore-api.herokuapp.com/api/v0/catalog/books)

Navigating to that link will give `Access Denied` because you need to have a `JWT` authorization token.
This `JWT` token is given to each user whenever they access the [web app](https://golden-book-bookstore-web.herokuapp.com/) and make a request.
The `JWT` token is verified and then the request is being processed.
This is a begginner implementation to protect API infrastructure from unwanted requests.

The `JWT` token can be set in the `.env` file at variable called `SECRET_JWT_TOKEN`.

After you set that variable, open `Postman` or something similar, go to `Headers` and add `Authorization` key to the value of the `SECRET_JWT_TOKEN`.

![Example of Postman call with Authorization header](/screenshots/jwt-token.png)

## Mocked data

Inside `scripts` folder, there is a file called `resetMockedData.ts`. Whenever you want to reset the mocked data, set the `RESET_MOCKED_DATA` variable inside `.env` file to `true` and then back to `false`.

## Technologies used

- Node.js, Express, Typescript

## Hosting

API hosted on Heroku [here](https://golden-book-bookstore-api.herokuapp.com/)
\
The web app is also hosted on Heroku [here](https://golden-book-bookstore-web.herokuapp.com/)

## Contributor

- [Me - Gabriel Arghire](https://github.com/JusticeBringer/) 100%
