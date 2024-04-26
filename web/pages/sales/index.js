import { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import useRequest from "../../hooks/use-request";

const SalesIndex = () => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState("2024-04-16");
  const [sales, setSales] = useState([]);

  const { doRequest, loading } = useRequest({
    url: "/api/queries/sales",
    method: "get",
    onSuccess: (sales) => setSales(sales),
  });

  useEffect(() => {
    doRequest({ query: { date } });
  }, []);

  let content;
  if (loading) {
    content = null;
  } else if (!sales.length) {
    content = "No sales yet";
  } else {
    content = (
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
  }

  return (
    <div>
      <h1>Sales</h1>
      <div className="mb-3">
        <label for="date">Starting from:</label>
        <input
          id="date"
          className="form-control"
          type="date"
          min="2024-04-16"
          max={today}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            doRequest({ query: { date: e.target.value } });
          }}
          disabled={loading}
        />
      </div>
      {content}
    </div>
  );
};

export default SalesIndex;
