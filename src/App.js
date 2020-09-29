import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Main from "./components/Main";

const routes = [
  {
    path: "/",
    component: Main,
    key: "main",
  },
];

function App() {
  return (
    <>
      <BrowserRouter>
        {routes.map((route) => {
          return (
            <Route
              key={route.key}
              path={route.path}
              component={route.component}
              exact={true}
            />
          );
        })}
      </BrowserRouter>
    </>
  );
}

export default App;
