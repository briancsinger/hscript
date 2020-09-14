import Link from 'next/link';
import BetaSignUp from './auth/beta-signup';
import Typography from '@material-ui/core/Typography';
import { Paper, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import RoleListItem from '../component/role/roleListItem';

const LandingPage = ({ currentUser, roles }) => {
    const roleList = (
        <Grid container direction="column" spacing={3}>
            <Grid item container direction="row" justify="space-between">
                <Grid item>
                    <Typography variant="h4" color="initial">
                        Roles
                    </Typography>
                </Grid>
                <Grid item>
                    <Link href="/roles/new" as="/roles/new">
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                        >
                            <Typography variant="button" color="initial">
                                New role
                            </Typography>
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2}>
                {roles.map((role) => (
                    <Grid item key={role.id} xs={12}>
                        <RoleListItem role={role} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );

    return (currentUser && roleList) || <BetaSignUp />;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    let roles = [];

    try {
        const { data } = await client.get('/api/roles');
        roles = data;
    } catch (e) {}

    return { roles };
};

export default LandingPage;
