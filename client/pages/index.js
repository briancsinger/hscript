import Link from 'next/link';
import BetaSignUp from './auth/beta-signup';
import Typography from '@material-ui/core/Typography';

const LandingPage = ({ currentUser, roles }) => {
    const roleList = roles.map((role) => {
        return (
            <tr key={role.id}>
                <td>{role.name}</td>
                <td>
                    <Link href="roles/[roleId]" as={`/roles/${role.id}`}>
                        <a>Details</a>
                    </Link>
                </td>
            </tr>
        );
    });

    return (
        (currentUser && (
            <Typography variant="h1" color="initial">
                ROOT SIGNED IN DASHBOARD
            </Typography>
        )) || <BetaSignUp />
    );
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
