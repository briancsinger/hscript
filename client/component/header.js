import Link from 'next/link';

export default ({ currentUser }) => {
    const links = [
        currentUser && { label: 'Create Role', href: '/roles/new' },
        !currentUser && { label: 'Sign up', href: '/auth/signup' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' },
        currentUser && { label: 'Sign out', href: '/auth/signout' },
    ]
        .filter((x) => x)
        .map(({ label, href }) => {
            return (
                <li key={href} className="nav-item">
                    <Link href={href}>
                        <a className="nav-link">{label}</a>
                    </Link>
                </li>
            );
        });

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                <a className="navbrand">hscript</a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    <li key="email" className="nav-item">
                        {currentUser.email}
                    </li>
                    {links}
                </ul>
            </div>
        </nav>
    );
};
