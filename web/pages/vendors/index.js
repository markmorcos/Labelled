import Link from "next/link";
import Table from "react-bootstrap/Table";
import { admins } from "@labelled/common";

import redirect from "../../api/redirect";

const VendorsIndex = ({ users, currentUser }) => {
  return (
    <div>
      <h1>
        Vendors{" "}
        {admins.includes(currentUser.email) && (
          <Link className="btn btn-primary btn-sm" href="/vendors/new">
            New
          </Link>
        )}
      </h1>
      <Table responsive>
        <thead>
          <tr>
            <th>Email</th>
            <th>Brands</th>
            <th>Settings</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email, vendors = [] }) => (
            <tr key={email}>
              <td>{email}</td>
              <td>{vendors.join(",")}</td>
              <td>
                {admins.includes(currentUser.email) && (
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/vendors/${id}/edit`}
                  >
                    Edit
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

VendorsIndex.getInitialProps = async (context, client) => {
  try {
    const { data: users } = await client.get("/api/auth/users");
    return { users };
  } catch (error) {
    return redirect({ context, path: "/" });
  }
};

export default VendorsIndex;
