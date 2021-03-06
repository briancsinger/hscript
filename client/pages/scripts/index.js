import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { Paper, Grid, Button, Container } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ScriptListItem from '../../component/role/scriptListItem';

const LandingPage = ({ currentUser, scripts }) => {
    const scriptList = (
        <Grid container direction="column" spacing={3}>
            <Grid item container direction="row" justify="space-between">
                <Grid item>
                    <Typography variant="h4" color="initial">
                        Scripts
                    </Typography>
                </Grid>
                {/* <Grid item>
                    <Link href="/scripts/new" as="/scripts/new">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                        >
                            <Typography variant="button" color="initial">
                                New script
                            </Typography>
                        </Button>
                    </Link>
                </Grid> */}
            </Grid>
            <Grid item container direction="column" spacing={2}>
                {scripts.map((script) => (
                    <Grid item key={script.id} xs={12}>
                        <ScriptListItem script={script} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );

    return <Container maxWidth="md">{scriptList}</Container>;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    let scripts = [];

    try {
        const { data } = await client.get('/api/scripts');
        scripts = data;
    } catch (e) {}
    return { scripts };
};

export default LandingPage;
