import Link from 'next/link';

const LandingPage = ({ currentUser, roles }) => {
    console.log({ roles });

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
        <div>
            <h2>Roles</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>{roleList}</tbody>
            </table>
        </div>
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
