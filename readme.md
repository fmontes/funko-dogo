# React and GraphQL ecommerce webapp
I develop this app while doing the [Advanced React & GraphQL](https://AdvancedReact.com) course by [Wes Bos](https://WesBos.com/)

DEMO: [https://funko-dogo-next-prod.herokuapp.com](https://funko-dogo-next-prod.herokuapp.com)

## Frontend

- [Next.js](https://github.com/zeit/next.js/) for server side rendering, routing and tooling
- [Styled Components](https://www.styled-components.com/) for styling
- [React-Apollo](https://github.com/apollographql/react-apollo) for interfacing with Apollo Client
- [Jest](https://jestjs.io/) & [Enzyme](https://airbnb.io/enzyme/) for Testing

## Data Management

- [Apollo Client](https://www.apollographql.com/docs/react/api/apollo-client.html) replaces the need for redux + data fetching/caching libraries

## Backend

#### [GraphQL Yoga](https://github.com/prisma/graphql-yoga): An Express GraphQL Server For:

- Implementing Query and Mutation Resolvers
- Custom Server Side Logic
- Charging Credit Cards with Stripe
- Sending Email
- Performing JWT Authentication
- Checking Permissions

#### [Prisma](https://www.prisma.io/)

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