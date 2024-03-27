import Table from "react-bootstrap/Table";

import redirect from "../../api/redirect";

const ProductsIndex = ({ products }) => {
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
          {products.map(({ id, sku, product, quantity, profit }) => (
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

ProductsIndex.getInitialProps = async (context, client) => {
  try {
    const { data: products } = await client.get("/api/products");
    return { products };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default ProductsIndex;
