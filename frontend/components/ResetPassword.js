import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            email
            name
        }
    }
`;

export default class ResetPassword extends Component {
    state = {
        password: '',
        confirmPassword: ''
    };

    saveToState = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <Mutation
                mutation={RESET_PASSWORD_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                  }}
            >
                {(reset, { error, loading, called }) => {
                    return (
                        <Form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                const res = await reset({});
                                this.setState({
                                    password: '',
                                    confirmPassword: ''
                                });
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Reset Password</h2>
                                <Error error={error} />
                                <label htmlFor="password">
                                    Password
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Reset"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <label htmlFor="confirmPassword">
                                    Password
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={this.state.confirmPassword}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Reset</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}
