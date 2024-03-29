import { useState } from "react";
import Router from "next/router";

import redirect from "../../../api/redirect";
import useRequest from "../../../hooks/use-request";

const VendorEdit = ({ user }) => {
  const [brands, setBrands] = useState(user.brands.join(","));

  const updateRequest = useRequest({
    url: `/api/auth/users/${user.id}`,
    method: "patch",
    body: { brands: brands.split(",") },
    onSuccess: () => Router.push("/vendors"),
  });

  const deleteRequest = useRequest({
    url: `/api/auth/users/${user.id}`,
    method: "delete",
    onSuccess: () => Router.push("/vendors"),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    updateRequest.doRequest();
  };

  const onDelete = (event) => {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this vendor?")) {
      deleteRequest.doRequest();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        {updateRequest.errors}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Brands (comma separated)
          </label>
          <input
            id="brands"
            className="form-control"
            type="text"
            value={brands}
            onChange={(e) => setBrands(e.target.value)}
            disabled={updateRequest.loading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={updateRequest.loading}
        >
          Update
        </button>
      </form>
      <form onSubmit={onDelete}>
        {deleteRequest.errors}
        <button
          type="submit"
          className="btn btn-danger"
          disabled={deleteRequest.loading}
        >
          Delete
        </button>
      </form>
    </>
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
