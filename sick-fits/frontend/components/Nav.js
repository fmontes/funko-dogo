import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => {
    return (
        <NavStyles>
            <User>
                {({ data: { me } }) => {
                    if (me) return <p>{me.name}</p>;
                    return null;
                }}
            </User>
            <Link href="/">
                <a>Home</a>
            </Link>
            <Link href="/sell">
                <a>Sell</a>
            </Link>
            <Link href="/items">
                <a>Shop</a>
            </Link>
            <Link href="/signup">
                <a>Sign Up</a>
            </Link>
        </NavStyles>
    );
};

export default Nav;
