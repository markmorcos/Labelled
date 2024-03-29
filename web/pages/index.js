import Table from "react-bootstrap/Table";

import redirect from "../api/redirect";

const LandingPage = ({ products }) => {
  const table = (
    <Table responsive>
      <thead>
        <tr>
          <th>Product</th>
          <th>Brand</th>
          <th>Current Inventory Quantity</th>
        </tr>
      </thead>
      <tbody>
        {products.map(({ id, sku, product, inventoryQuantity }) => (
          <tr key={id}>
            <td>{sku}</td>
            <td>{product.vendor}</td>
            <td>{inventoryQuantity}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <div>
      <h1>Inventory</h1>
      {table}
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  try {
    const { data: products } = await client.get("/api/queries/products");
    return { products };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default LandingPage;
