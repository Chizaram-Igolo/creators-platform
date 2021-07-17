import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { AuthProvider } from "./contexts/AuthContext";
import {
  Signin,
  Signout,
  Signup,
  Feed,
  Profile,
  Settings,
  ForgotPassword,
} from "./Screens";
import { Header, PrivateRoute, ConnectivityListener } from "./Components";

import "./App.css";

const routes = [
  { route: "/signin", component: <Signin /> },
  { route: "/signout", component: <Signout /> },
  { route: "/signup", component: <Signup /> },
  { route: "/help", component: <Feed /> },
  { route: "/forgot-password", component: <ForgotPassword /> },
  { route: "/", component: <Feed />, exact: true },
];

function App() {
  const { addToast } = useToasts();

  return (
    <Router>
      <AuthProvider>
        <Header />
        <ConnectivityListener />
        <div className="pt-5 px-2">
          <Switch>
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/settings" component={Settings} />

            {/* <PrivateRoute exact path="/app/dashboard">
              <Content
                navWidth={navWidth}
                widthOffset={widthOffset}
                contentClassName={contentClassName}
                shouldHideNavText={shouldHideNavText}
                expandIcon={expandIcon}
                handleChangeWidth={handleChangeWidth}
              >
                <Dashboard />
              </Content>
            </PrivateRoute> */}
            {/* {routes.map((item, id) => {
              return (
                <PrivateRoute path={item.route} key={id}>
                  <Content
                    navWidth={navWidth}
                    widthOffset={widthOffset}
                    contentClassName={contentClassName}
                    shouldHideNavText={shouldHideNavText}
                    expandIcon={expandIcon}
                    handleChangeWidth={handleChangeWidth}
                  >
                    {item.component}
                  </Content>
                </PrivateRoute>
              );
            })} */}
            {routes.map((item, id) => {
              return (
                <Route path={item.route} key={id} exact={item.exact}>
                  {item.component}
                </Route>
              );
            })}
            <Route path="/feed">
              <Feed addToast={addToast} />
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
