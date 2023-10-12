import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "../index.css";
import Logo from "../assets/logo2.svg";
import User from "../assets/logo2.svg";
import UserButton from "../assets/robot-user.png";
import Badge from "react-bootstrap/Badge";
import { useGlobalContext } from "../../context/walletContext";

function NavbarComp() {
  const [show, setShow] = useState(false);

  const { address, deposited, tickets, withdrawableBalance, Deposit, Claim } =
    useGlobalContext();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar
        bg="dark"
        style={{ boxShadow: "0px -20px 40px 0px #4c67aa" }}
        data-bs-theme="dark"
        className="navbar-comp"
      >
        <Container>
          <Navbar.Brand href="/" style={{ fontSize: 32 }}>
            <img
              alt=""
              src={Logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              style={{ marginRight: 5 }}
            />
            𝖺𝗂𝖠𝗋𝖾𝗇𝖺
          </Navbar.Brand>
          <ConnectButton />
        </Container>
        <Button
          style={{ background: "#212529", borderColor: "#212529" }}
          onClick={handleShow}
          className="me-2"
        >
          <img alt="" src={UserButton} width="50" height="50" style={{marginRight:"30px"}} />
        </Button>
      </Navbar>

      <Offcanvas
        style={{
          background: "linear-gradient(to bottom, #e3eeff,#7e9ff2,#f3e7e9)",
        }}
        show={show}
        onHide={handleClose}
        placement="end"
        name="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <code style={{color:"black"}}>User Detail</code>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <img alt="" src={User} width="90%" height="40%" />
          {address ? (
            <>
              <div
                style={{ minHeight: "50%", minWidth: "87%" }}
                className="card card-5"
              >
                <div className="card__icon">
                  <Badge className="icon-badge" bg="black">
                    address.slice(0, 4) + "..." + address.slice(38)
                  </Badge>

                  <Badge className="icon-badge" bg="black">
                    Tickets: {tickets}
                  </Badge>
                  <Badge className="icon-badge" bg="black">
                    Deposited: {deposited}
                  </Badge>
                  <Badge className="icon-badge" bg="black">
                    Balance: {withdrawableBalance}
                  </Badge>
                </div>

                <p className="card__apply">
                  <Button
                    onClick={() => Deposit()}
                    id="deposit-button"
                    variant="outline-dark"
                  >
                    Deposit
                  </Button>
                  <Button onClick={() => Claim()} variant="outline-dark">
                    Withdraw (Claim)
                  </Button>
                </p>
              </div>
            </>
          ) : (
            <div className="text" style={{}}>Connect Wallet</div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default NavbarComp;
