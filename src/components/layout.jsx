import Navbar from "./navbarComp";

function Layout({ children }) {

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}


export default Layout;
