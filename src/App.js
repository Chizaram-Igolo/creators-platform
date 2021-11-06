import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "./hooks/useDarkMode";
import { AuthProvider } from "./contexts/AuthContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import {
  Signin,
  Signout,
  Signup,
  Feed,
  Settings,
  ForgotPassword,
  UserFeed,
} from "./Screens";

import {
  GlobalStyles,
  Header,
  PrivateRoute,
  ConnectivityListener,
  Toggle,
  SideBar,
  LeftSideBarSettings,
} from "./Components";

import { lightTheme, darkTheme } from "./Components/Theme";
import ErrorBoundary from "./Components/ErrorBoundary";
import "./App.css";

const routes = [
  { route: "/signin", component: <Signin /> },
  { route: "/signout", component: <Signout /> },
  { route: "/signup", component: <Signup /> },
  { route: "/help", component: <Feed /> },
  { route: "/forgot-password", component: <ForgotPassword /> },
];

function App() {
  const [theme, themeToggler, setLightMode, setDarkMode, mountedComponent] =
    useDarkMode();

  const themeMode = theme === "light" ? lightTheme : darkTheme;

  if (!mountedComponent) {
    return <div />;
  }

  return (
    <Router>
      <ThemeProvider theme={themeMode}>
        <ErrorBoundary>
          <GlobalStyles />
          <AuthProvider>
            <Header />
            <ConnectivityListener />
            <div className="pt-5 px-2">
              <Toggle theme={theme} toggleTheme={themeToggler} />
              <Switch>
                <PrivateRoute path="/settings">
                  <Settings
                    setLightMode={setLightMode}
                    setDarkMode={setDarkMode}
                  />
                </PrivateRoute>

                {routes.map((item, id) => {
                  return (
                    <Route path={item.route} key={id}>
                      {item.component}
                    </Route>
                  );
                })}

                <Container className="px-0">
                  <Row>
                    <Col
                      md={{ span: 3 }}
                      className="d-none d-md-block"
                      style={{ position: "fixed" }}
                    >
                      {/* <LeftSideBar /> */}
                      <LeftSideBarSettings />
                    </Col>

                    <Col
                      md={{ span: 8, offset: 3 }}
                      lg={{ span: 7, offset: 3 }}
                      className="pt-md-5"
                    >
                      <Switch>
                        <Route path="/feed" component={Feed} />
                        <Route path="/:id" component={UserFeed} />
                        <Route path="/profile" component={UserFeed} />
                        <Route path="/" component={Feed} />
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
              </Switch>
            </div>
          </AuthProvider>{" "}
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

export default App;
