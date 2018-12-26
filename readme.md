# React and GraphQL ecommerce webapp
I develop this app while doing the [Advanced React & GraphQL](https://AdvancedReact.com) course by [Wes Bos](https://WesBos.com/)

DEMO: *Coming soon*

## Frontend

- Next.js for server side rendering, routing and tooling
- Styled Components for styling
- React-Apollo for interfacing with Apollo Client
- Jest & Enzyme for Testing

## Data Management

- Apollo Client replaces the need for redux + data fetching/caching libraries

## Backend

#### GraphQL Yoga: An Express GraphQL Server For:

- Implementing Query and Mutation Resolvers
- Custom Server Side Logic
- Charging Credit Cards with Stripe
- Sending Email
- Performing JWT Authentication
- Checking Permissions

#### Prisma

- Provides a set of GraphQL CRUD APIs for a MySQL, Postgres or MongoDB Database
- Schema Definition
- Data Relationships
- Queried Directly from our Yoga Server
- Self-hosted or as-a-service

## How to run it:
1. Clone the repo
2. From the folders `backend` and `frontend` run:
    - `npm install`
    - `npm run dev`
3. GraphQL server runs: [http://localhost:4444](http://localhost:4444)
4. Webapp (react) runs: [http://localhost:7777](http://localhost:7777)

## Unit testing:
From the `frontend` folder run: `npm run test`