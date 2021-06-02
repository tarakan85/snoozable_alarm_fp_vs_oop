import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { AppFunctional, AppOOP } from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <AppFunctional />
    <AppOOP />
  </StrictMode>,
  rootElement
);
