import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brands, setBrands] = useState("");

  const { doRequest, loading, errors } = useRequest({
    url: "/api/auth/users",
    method: "post",
    body: { email, password, brands: brands.split(",") },
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
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          className="form-control"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="brands" className="form-label">
          Brands (comma separated)
        </label>
        <input
          id="brands"
          className="form-control"
          type="text"
          value={brands}
          onChange={(e) => setBrands(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        Create
      </button>
    </form>
  );
};
