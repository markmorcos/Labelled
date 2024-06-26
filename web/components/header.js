import Link from "next/link";
import Router from "next/router";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { admins } from "@labelled/common";

import useRequest from "../hooks/use-request";

export default ({ currentUser }) => {
  const { doRequest: signOut } = useRequest({
    url: "/api/auth/sign-out",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  const links = currentUser
    ? [
        ...(admins.includes(currentUser.email)
          ? [{ label: "Vendors", href: "/vendors" }]
          : []),
        { label: "Sales", href: "/sales" },
      ]
    : [{ label: "Start", href: "/start" }];

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Link className="navbar-brand" href="/">
          <img height="32" src="/logo.png" />
        </Link>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto mb-2 mb-lg-0">
            {links.map(({ label, href }) => (
              <li key={href} className="nav-item">
                <Link className="nav-link" href={href}>
                  {label}
                </Link>
              </li>
            ))}
            {currentUser && (
              <li className="nav-item">
                <button className="nav-link" onClick={() => signOut()}>
                  Sign Out ({currentUser.email})
                </button>
              </li>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
