import React, { useState } from "react";
import Lazy from "./components/Lazy";

const Main = Lazy(() => import("./components/Main/Main"));
const Login = Lazy(() => import("./components/Login/Login"));
function App() {
  let [data, updatedata] = useState();
  let [auth, updateauth] = useState();
  let login = (auth, data) => {
    updateauth(auth);
    updatedata(data);
  };
  return (
    <>
      <div className="jumbotron text-center">
        <h1>TO-DO</h1>
      </div>
      <div className="container">
        <div className="row">
          {auth ? (
            <Main login={login} data={data} token={auth} />
          ) : (
            <Login login={login} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
