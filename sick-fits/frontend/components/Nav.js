import Link from 'next/link';

const Nav = () => {
    return (
        <nav>
            <li>
                <Link href="/">
                    <a>Home</a>
                </Link>
            </li>
            <li>
                <Link href="/sell">
                    <a>Sell</a>
                </Link>
            </li>
        </nav>
    );
};

export default Nav;
