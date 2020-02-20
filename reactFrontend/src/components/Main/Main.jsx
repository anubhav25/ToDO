import React, { memo } from "react";
import List from "../List/List";
const baseUrl = ""; // "http://localhost:4000";

function Main(props) {
  let { data, login, token } = props;
  let handleres = async res => {
    res = await res.json();
    if (res.result) {
      login(res.token, res.data);
    } else {
      if (res.logout) {
        login();
      }
    }
  };
  let addTask = async (title, desc) => {
    let res = await fetch(baseUrl + "/todo/add", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token
      },
      method: "POST",
      body: JSON.stringify({
        title,
        desc,
        date: +Date.now()
      })
    });
    handleres(res);
  };
  let deleteTask = async id => {
    let res = await fetch(baseUrl + "/todo/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token
      },
      method: "DELETE"
    });
    handleres(res);
  };
  let editTask = async (title, desc, id) => {
    let res = await fetch(baseUrl + "/todo/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token
      },
      method: "PUT",
      body: JSON.stringify({
        title,
        desc
      })
    });
    handleres(res);
  };

  return (
    <>
      <div className="col-12 col-lg-8 col-md-10 mx-auto">
        <List
          data={data}
          deleteTask={deleteTask}
          editTask={editTask}
          addTask={addTask}
        />
      </div>
    </>
  );
}

export default memo(Main);
