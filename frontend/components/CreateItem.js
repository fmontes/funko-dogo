import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from '../components/ErrorMessage';
import Router from 'next/router';
import formatMoney from '../lib/formatMoney.js';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage) {
            id
        }
    }
`;

export default class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    };

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

    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, { loading, error }) => (
                    <Form
                        onSubmit={async e => {
                            e.preventDefault();
                            const res = await createItem();
                            Router.push({
                                pathname: '/item',
                                query: {
                                    id: res.data.createItem.id
                                }
                            });
                        }}
                    >
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="image">
                                Image
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    placeholder="Image"
                                    required
                                    onChange={this.uploadFile}
                                />
                                {this.state.image && <img src={this.state.image} alt="Preview image" />}
                            </label>

                            <label htmlFor="title">
                                Title
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Title"
                                    required
                                    onChange={this.handleChage}
                                    value={this.state.title}
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
                                    value={this.state.price}
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
                                    value={this.state.description}
                                />
                            </label>

                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        );
    }
}

export { CREATE_ITEM_MUTATION };
