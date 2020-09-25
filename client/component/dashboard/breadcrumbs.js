import Typography from '@material-ui/core/Typography';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    breadcrumbLink: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
}));

const Breadcrumbs = ({ pathName = '', currentPageName }) => {
    const classes = useStyles();
    const paths = pathName.split('/').filter((x) => x);

    const crumbs = paths.reduce((accum, path) => {
        switch (path) {
            case 'roles': {
                accum.push({
                    href: '/roles',
                    as: '/roles',
                    name: 'Roles',
                });
            }
        }
        return accum;
    }, []);

    if (!crumbs.length) return;

    const renderCrumbs = () =>
        crumbs.map((c) => (
            <Link href={c.href} as={c.as} key={c.href}>
                <MuiLink
                    className={classes.breadcrumbLink}
                    variant="overline"
                    color="inherit"
                >
                    {c.name}
                </MuiLink>
            </Link>
        ));

    const currentPageNameSliced =
        currentPageName.length > 20
            ? `${currentPageName.slice(0, 17)}...`
            : currentPageName;

    return (
        <MuiBreadcrumbs aria-label="breadcrumb">
            {renderCrumbs()}
            <Typography variant="overline" color="textPrimary">
                {currentPageNameSliced}
            </Typography>
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;
