import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

class User extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            id: PropTypes.string,
            permission: PropTypes.array
        }).isRequired
    };
    state = {
        permissions: this.props.user.permissions
    };

    handlePermissionChange = (e) => {
        const checkbox = e.target;
        let updatedPermissions = [...this.state.permissions];

        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value)
        } else {
            updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value)
        }

        this.setState({
            permissions: updatedPermissions
        })
    }

    render() {
        const user = this.props.user;
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => <td key={permission}>
                    <label htmlFor={`${user.id}-permission-${permission}`}>
                        <input type="checkbox"
                        id={`${user.id}-permission-${permission}`}
                        checked={this.state.permissions.includes(permission)}
                        value={permission}
                        onChange={this.handlePermissionChange} />
                    </label>
                </td>)}
                <td>
                    <SickButton>Update</SickButton>
                </td>
            </tr>
        )
    }
}


const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE'
]

const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => (
        console.log(data) ||
        <div>
            <Error error={error} />
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.users.map(user => <User key={user.id} user={user} />)
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )}
    </Query>
)

export default Permissions;