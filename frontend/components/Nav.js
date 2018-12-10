import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => {
    return (
        <User>
            {({ data: { me } }) => (
                <NavStyles>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    {me && (
                        <>
                            <Link href="/orders">
                                <a>Orders</a>
                            </Link>
                            <Link href="/sell">
                                <a>Sell</a>
                            </Link>
                            <Link href="/account">
                                <a>Account</a>
                            </Link>
                        </>
                    )}

                    <Link href="/items">
                        <a>Shop</a>
                    </Link>
                    <Link href="/signup">
                        <a>Sign In</a>
                    </Link>
                </NavStyles>
            )}
        </User>
    );
};

export default Nav;
