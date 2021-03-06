import React from "react";
import ReactDOM from "react-dom";
import { ToastProvider } from "react-toast-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "material-icons/iconfont/outlined.css";
import SimpleReactLightbox from "simple-react-lightbox-pro";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <ToastProvider>
      <SimpleReactLightbox>
        <App />
      </SimpleReactLightbox>
    </ToastProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
