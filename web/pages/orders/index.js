import Link from "next/link";
import Table from "react-bootstrap/Table";

import { OrderStatus } from "@labelled/common";

import redirect from "../../api/redirect";

const OrdersIndex = ({ orders }) => {
  return (
    <div>
      <h1>Orders</h1>
      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Event</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(({ id, ticket, status }) => (
            <tr key={id}>
              <td>
                <Link href="/">{id}</Link>
              </td>
              <td>€0</td>
              <td>
                <Link href="/">Event</Link>
              </td>
              <td>
                <span className="badge rounded-pill text-bg-success">
                  Success
                </span>
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
