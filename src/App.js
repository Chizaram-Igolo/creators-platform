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
  LeftSideBar,
} from "./Components";

import { lightTheme, darkTheme } from "./Components/Theme";
import "./App.css";

const routes = [
  { route: "/signin", component: <Signin /> },
  { route: "/signout", component: <Signout /> },
  { route: "/signup", component: <Signup /> },
  { route: "/help", component: <Feed /> },
  { route: "/forgot-password", component: <ForgotPassword /> },
  // { route: "/:id", component: <UserFeed /> },
  // { route: "/", component: <Feed />, exact: true },
];

function App() {
  const [theme, themeToggler, mountedCompnent] = useDarkMode();

  const themeMode = theme === "light" ? lightTheme : darkTheme;

  if (!mountedCompnent) {
    return <div />;
  }
  return (
    <Router>
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />
        <AuthProvider>
          <Header />
          <ConnectivityListener />
          <div className="pt-5 px-2">
            <Toggle theme={theme} toggleTheme={themeToggler} />
            <Switch>
              <PrivateRoute path="/settings" component={Settings} />

              {routes.map((item, id) => {
                return (
                  <Route path={item.route} key={id}>
                    {item.component}
                  </Route>
                );
              })}

              <Container className="px-0">
                <Row>
                  <Col md={{ span: 3 }} className="d-none d-md-block">
                    <LeftSideBar />
                  </Col>

                  <Col md={{ span: 8 }} lg={{ span: 7 }} className="pt-md-5">
                    <Switch>
                      <Route path="/feed" component={Feed} />
                      <Route path="/:id" component={UserFeed} />
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
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
