import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => {
    return (
        <NavStyles>
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
