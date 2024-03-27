import Table from "react-bootstrap/Table";

import redirect from "../../api/redirect";

const SalesIndex = ({ sales }) => {
  return (
    <div>
      <h1>Sales</h1>
      <Table responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(({ id, sku, product, quantity, profit }) => (
            <tr key={id}>
              <td>{sku}</td>
              <td>{product.vendor}</td>
              <td>{quantity}</td>
              <td>E£ {profit}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

SalesIndex.getInitialProps = async (context, client) => {
  try {
    const { data: sales } = await client.get("/api/queries/sales");
    return { sales };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default SalesIndex;
