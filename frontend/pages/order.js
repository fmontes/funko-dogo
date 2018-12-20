import React from 'react';
import PleaseSignin from '../components/PleaseSignin';
import Order from '../components/Order';

const OrderPage = props => (
    <div>
        <PleaseSignin>
            <Order id={props.query.id}></Order>
        </PleaseSignin>
    </div>
)

export default OrderPage;
