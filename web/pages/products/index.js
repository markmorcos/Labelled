import Link from "next/link";
import Table from "react-bootstrap/Table";

import redirect from "../../api/redirect";

const ProductsIndex = ({ products }) => {
  return (
    <div>
      <h1>Products</h1>
      <Table responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Profit</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ id, sku, product }) => (
            <tr key={id}>
              <td>
                <Link href={`/products/${encodeURIComponent(`${id}`)}`}>
                  {sku}
                </Link>
              </td>
              <td>0</td>
              <td>{product.vendor}</td>
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
