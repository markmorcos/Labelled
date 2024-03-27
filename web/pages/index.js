import Link from "next/link";

const LandingPage = () => {
  return (
    <Link className="link-underline link-underline-opacity-0" href="/sales">
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="text-center">Sales</h1>
          </div>
        </div>
      </div>
    </Link>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  return {};
};

export default LandingPage;
