import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney.js';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(id: $id, title: $title, description: $description, price: $price) {
            id
            title
            description
            price
        }
    }
`;

export default class UpdateItem extends Component {
    state = {};

    handleChage = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({
            [name]: val
        });
    };

    uploadFile = async e => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/fmontes/image/upload', {
            method: 'POST',
            body: data
        });
        const file = await res.json();

        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    };

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
    };

    render() {
        return (
            <Query
                query={SINGLE_ITEM_QUERY}
                variables={{
                    id: this.props.id
                }}
            >
                {({ data, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (!data.item) return <p>No item found</p>;
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { loading, error }) => (
                                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                                    <Error error={error} />
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                placeholder="Title"
                                                required
                                                onChange={this.handleChage}
                                                defaultValue={data.item.title}
                                            />
                                        </label>

                                        <label htmlFor="price">
                                            Price
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                placeholder="Price"
                                                required
                                                onChange={this.handleChage}
                                                defaultValue={data.item.price}
                                            />
                                        </label>

                                        <label htmlFor="description">
                                            Description
                                            <textarea
                                                id="description"
                                                name="description"
                                                placeholder="Enter a Description"
                                                required
                                                onChange={this.handleChage}
                                                defaultValue={data.item.description}
                                            />
                                        </label>

                                        <button type="submit">Submit</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export { UPDATE_ITEM_MUTATION };
