import React, { useState } from "react";
import styles from "./Login.module.scss";
import classNames from "classnames";
import SimpleCrypto from "simple-crypto-js";
const _secretKey = "asdasdjaksjdkajskl;asdjalksdj";
const crypto = new SimpleCrypto(_secretKey);

const baseUrl = ""; //"http://localhost:4000";
export default function Login(props) {
  let username = useFormInput("");
  let password = useFormInput("");
  let [error, update_error] = useState(false);
  let displayNone = { display: "none" };
  let empty = {};
  let handleClick = async e => {
    e.preventDefault();

    let u = username.value;
    let p = password.value;
    if (!(u && p)) {
      update_error(true);
      return;
    }

    try {
      update_error(false);
      let res = await fetch(baseUrl + "/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          username: u,
          password: crypto.encrypt(p)
        })
      });
      res = await res.json();
      if (res.result) {
        update_error(false);
        props.login(res.token, res.data);
      } else {
        update_error(true);
      }
    } catch (err) {
      update_error(true);
      console.log(err);
    }
  };

  return (
    <div className="col-12 col-lg-8 col-md-10 mx-auto">
      <form onSubmit={handleClick}>
        <div className="m-2">
          <input
            type="text"
            className={classNames(styles.Input, "m-3")}
            name="name"
            {...username}
            placeholder="username"
            autoFocus
            required
          />
        </div>
        <div className="m-2">
          <input
            type="password"
            className={classNames(styles.Input, "m-3")}
            name="name"
            {...password}
            placeholder="password"
            required
          />
        </div>
        <div className={styles.Error} style={error ? empty : displayNone}>
          <div className="">Please enter correct details.</div>
        </div>

        <div className="">
          <button
            onClick={handleClick}
            type="submit"
            disabled={username.length < 3 || password.length < 3}
            className={classNames("btn btn-outline-primary m-3 px-5 py-2")}
            id="submit_ph_no"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
function useFormInput(v) {
  let [value, change] = useState(v);
  let onChange = e => change(e.target.value);
  return { value, onChange };
}
