import { useState } from "react";

import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [vendors, setVendors] = useState("");

  const { doRequest, loading, errors } = useRequest({
    url: "/api/auth/sign-up",
    method: "post",
    body: { email, vendors: vendors.split(",") },
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
          Email
        </label>
        <input
          id="email"
          className="form-control"
          type="email"
          aria-describedby="emailHelp"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
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
        Create
      </button>
    </form>
  );
};
