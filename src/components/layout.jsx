import Navbar from "./navbarComp";

function Layout({ children }) {

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #e3eeff,#7e9ff2,#f3e7e9)",
      }}
    >
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
