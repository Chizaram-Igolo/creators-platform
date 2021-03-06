import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import { LeftSideBarSettings, PrivateRoute, SideBar } from "../../Components";

import "../styles/Signin.css";
import Profile from "./Profile";
import Account from "./Account";
import Preferences from "./Preferences";
import PaymentBilling from "./PaymentBilling";
import Privacy from "./Privacy";
import Security from "./Security";

function Settings({ setLightMode, setDarkMode }) {
  let { path } = useRouteMatch();

  return (
    <>
      <Container className="px-0">
        <Row>
          <Col
            md={{ span: 3 }}
            className="d-none d-md-block"
            style={{ position: "fixed" }}
          >
            <LeftSideBarSettings />
          </Col>

          <Col
            md={{ span: 8, offset: 3 }}
            lg={{ span: 7, offset: 3 }}
            className="pt-2 pt-md-5"
          >
            <Switch>
              <PrivateRoute path={`${path}/profile`} component={Profile} />
              <PrivateRoute path={`${path}/account`} component={Account} />
              <PrivateRoute
                path={`${path}/preferences`}
                // component={Preferences}
              >
                <Preferences
                  setLightMode={setLightMode}
                  setDarkMode={setDarkMode}
                />
              </PrivateRoute>

              <PrivateRoute
                path={`${path}/payment`}
                component={PaymentBilling}
              />
              <PrivateRoute path={`${path}/privacy`} component={Privacy} />
              <PrivateRoute path={`${path}/security`} component={Security} />
              <PrivateRoute path={`${path}`} component={Profile} />
            </Switch>
          </Col>

          <Col className="d-none d-md-block">
            <SideBar>
              <Nav
                defaultActiveKey="/"
                className="flex-column fixed-position"
              ></Nav>
            </SideBar>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Settings;
