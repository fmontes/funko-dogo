import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            charge
            total
            createdAt
            user {
                id
            }
            items {
                id
                title
                description
                price
                image
                quantity
            }
        }
    }
`;

export default class Order extends Component {
    render() {
        return (
            <Query query={SINGLE_ORDER_QUERY} variables={{
                id: this.props.id
            }}>
                {({data, error, loading}) => {
                    const order = data.order;
                    if (error) return <Error error={error}></Error>
                    if (loading) return <p>Loading</p>
                    return(
                        <OrderStyles>
                            <Head>
                                <title>Sick Fits | Order: {order.id}</title>
                            </Head>
                            <p>
                                <span>Order ID:</span>
                                <span>{order.id}</span>
                            </p>
                            <p>
                                <span>Charge:</span>
                                <span>{order.charge}</span>
                            </p>
                            <p>
                                <span>Date:</span>
                                <span>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</span>
                            </p>
                            <p>
                                <span>Total:</span>
                                <span>{formatMoney(order.total)}</span>
                            </p>
                            <p>
                                <span>Item count:</span>
                                <span>{order.items.length}</span>
                            </p>
                            <div className="items">
                                {order.items.map(item => (
                                    <div className="order-item" key={item.id}>
                                        <img width="50" src={item.image} alt={item.title} />
                                        <div className="item-details">
                                            <h2>{item.title}</h2>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Each: {formatMoney(item.price)}</p>
                                            <p>Total: {formatMoney(item.price * item.quantity)}</p>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </OrderStyles>
                    )
                }}
            </Query>
        );
    }
}