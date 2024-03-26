import Link from "next/link";
import Table from "react-bootstrap/Table";
import { formatDistance } from "date-fns";

import redirect from "../../api/redirect";

const OrdersIndex = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, name, amount, createdAt }) => (
            <tr key={name}>
              <td>
                <Link href={`/orders/${encodeURIComponent(`${id}`)}`}>
                  {name}
                </Link>
              </td>
              <td>EGP {amount}</td>
              <td>
                {formatDistance(createdAt, new Date(), {
                  addSuffix: true,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

OrdersIndex.getInitialProps = async (context, client) => {
  try {
    const { data: orders } = await client.get("/api/orders");
    return { orders };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default OrdersIndex;
