import Table from "react-bootstrap/Table";

import redirect from "../../api/redirect";

const SalesIndex = ({ sales }) => {
  const table = (
    <Table responsive>
      <thead>
        <tr>
          <th>Product</th>
          <th>Brand</th>
          <th>Original Sold Quantity</th>
          <th>Original Sold Amount</th>
          <th>Discounts</th>
          <th>Current Sold Quantity</th>
          <th>Current Sold Amount</th>
        </tr>
      </thead>
      <tbody>
        {sales.map(
          ({
            id,
            sku,
            product,
            originalQuantity,
            originalAmount,
            currentDiscounts,
            currentQuantity,
            currentAmount,
          }) => (
            <tr key={id}>
              <td>{sku}</td>
              <td>{product.vendor}</td>
              <td>{originalQuantity}</td>
              <td>E£ {originalAmount}</td>
              <td>E£ {currentDiscounts}</td>
              <td>{currentQuantity}</td>
              <td>E£ {currentAmount}</td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  );

  return (
    <div>
      <h1>Sales</h1>
      {sales.length > 0 ? table : "No sales yet"}
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
