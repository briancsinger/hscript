import Router from 'next/router';

const OrdersPage = ({ currentUser, orders }) => {
    console.log({ orders });

    const orderList = orders.map((order) => {
        return (
            <tr key={order.id}>
                <td>{order.ticket.title}</td>
                <td>{order.status}</td>
            </tr>
        );
    });

    return (
        <div>
            <h1>Orders</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Ticket</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>{orderList}</tbody>
            </table>
        </div>
    );
};

OrdersPage.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');

    return { orders: data };
};

export default OrdersPage;
