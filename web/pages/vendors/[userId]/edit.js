import { useState } from "react";
import Router from "next/router";

import redirect from "../../../api/redirect";
import useRequest from "../../../hooks/use-request";

const VendorEdit = ({ user }) => {
  const [vendors, setVendors] = useState(user.vendors.join(","));

  const { doRequest, loading, errors } = useRequest({
    url: `/api/auth/users/${user.id}`,
    method: "patch",
    body: { vendors: vendors.split(",") },
    onSuccess: () => Router.push("/vendors"),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      {errors}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Brands (comma separated)
        </label>
        <input
          id="brands"
          className="form-control"
          type="text"
          value={vendors}
          onChange={(e) => setVendors(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Update
      </button>
    </form>
  );
};

VendorEdit.getInitialProps = async (context, client) => {
  const { userId } = context.query;

  try {
    const { data: user } = await client.get(`/api/auth/users/${userId}`);
    return { user };
  } catch (error) {
    return redirect({ context, path: "/vendors" });
  }
};

export default VendorEdit;
