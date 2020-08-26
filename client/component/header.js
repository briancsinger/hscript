import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';

// import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Menu'
// import Toolbar from '@material-ui/core/Toolbar'
// import Typography from '@material-ui/core/Typography'

const ButtonLink = ({ className, href, hrefAs, children, prefetch }) => (
    <Link href={href} as={hrefAs} prefetch>
        <a className={className}>{children}</a>
    </Link>
);

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
}));

export default ({ currentUser }) => {
    const classes = useStyles();

    const links = [
        currentUser && { label: 'Create Role', href: '/roles/new' },
        !currentUser && { label: 'Sign up', href: '/auth/signup' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' },
        currentUser && { label: 'Sign out', href: '/auth/signout' },
    ]
        .filter((x) => x)
        .map(({ label, href }) => {
            return (
                <Button color="inherit" component={ButtonLink} href={href}>
                    {label}
                </Button>
            );
        });

    return (
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Button color="inherit" component={ButtonLink} href={'/'}>
                    HSCRIPT
                </Button>
                <div className={classes.grow} />
                {currentUser && <Typography>{currentUser.email}</Typography>}
                {links}
            </Toolbar>
        </AppBar>
    );
};
