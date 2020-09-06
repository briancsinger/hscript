import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../hooks/use-request';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    gridContainer: {
        height: '90vh',
    },
    progress: {
        marginTop: theme.spacing(4),
    },
}));

export default () => {
    const classes = useStyles();

    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/'),
    });

    useEffect(() => {
        doRequest();
    }, []);

    return (
        <Grid
            className={classes.gridContainer}
            container
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <Typography variant="h3" color="initial" align="center">
                    Signing you out...
                </Typography>
                <LinearProgress className={classes.progress} />
            </Grid>
        </Grid>
    );
};
