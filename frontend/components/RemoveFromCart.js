import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import  styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;

    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`;


export default class RemoveFromCart extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }

    // Gets called as soon as we get a response BACK from the server
    // after the mutation has been performed
    update = (cache, payload) => {
        // 1. read the cache
        const data = cache.readQuery({
            query: CURRENT_USER_QUERY
        });
        // 2. remove the item from the cache
        const cartItemId = payload.data.removeFromCart.id;
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
        // 3. write it back to cache
        cache.writeQuery({
            query: CURRENT_USER_QUERY, data
        });
    }

    render() {
        return (
            <Mutation
                mutation={REMOVE_FROM_CART_MUTATION}
                variables={{id: this.props.id}}
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation',
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }}
                >
                    {(removeFromCart, {error, loading}) => {
                        return <BigButton disabled={loading} onClick={() => removeFromCart().catch(e => alert(e.message))} title="Delete Items">&times;</BigButton>
                }}
            </Mutation>
        )
    }
}
