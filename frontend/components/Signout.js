import React from 'react';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { CURRENT_USER_QUERY } from './User';

const LOGOUT_MUTATION = gql`
    mutation LOGOUT_MUTATION {
        logout {
            message
        }
    }
`;

const Signout = props => {
    return (
        <Mutation mutation={LOGOUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
            {(logout, { loading, error }) => {
                return <button onClick={logout}>Logout</button>;
            }}
        </Mutation>
    );
};

export default Signout;
