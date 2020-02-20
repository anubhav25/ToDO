import React, { useState, memo, useRef } from "react";
import arrow from "../../assets/arrow.svg";
import plusWhite from "../../assets/plusWhite.svg";
import Pagination from "react-js-pagination";
import Modal from "./Modal";
import "./list.scss";
const ITEMSPERPAGE = 10;

function List(props) {
  let [show, updateShow] = useState(false);
  let [activePage, changeactivePage] = useState(1);
  let [globalData, updateGlobalData] = useState({
    title: "",
    desc: "",
    key: "",
    saveData: null
  });

  let updateModal = (bool, vals) => {
    updateGlobalData(vals);
    updateShow(bool);
  };
  let hideModal = () => {
    let vals = {
      title: "",
      desc: "",
      key: "",
      saveData: null
    };
    updateModal(false, vals);
  };

  let { data, deleteTask, editTask, addTask } = props;
  data = data || [];

  return (
    <div className="expandable-listview_outerDiv">
      {show && <Modal handleClose={hideModal} data={globalData}></Modal>}
      <ul className="expandable-listview_ul">
        {data
          .filter(
            (x, i) =>
              i >= (activePage - 1) * ITEMSPERPAGE &&
              i < activePage * ITEMSPERPAGE
          )
          .map(k => {
            return (
              <div key={k.id}>
                <li>
                  <div
                    className="expandable-listview_listHeader"
                    // onClick={handleToggle.bind(this, k)}
                    onClick={() => {
                      let vals = {
                        title: k.title,
                        desc: k.desc,
                        key: k.id,
                        saveData: editTask
                      };
                      updateModal(true, vals);
                    }}
                  >
                    <img src={arrow} className="expandable" alt="plus" />
                    {k.title}
                    <span>
                      <button className="deleteButton" onClick={() => {}}>
                        &#x270E;
                      </button>
                      <button
                        className="deleteButton"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log(e);
                          deleteTask(k.id);
                        }}
                      >
                        &#x2716;
                      </button>
                    </span>
                  </div>
                </li>
              </div>
            );
          })}
        <div>
          <li>
            <div
              className="expandable-listview_listHeader"
              onClick={() => {
                let vals = {
                  title: "",
                  desc: "",
                  key: "",
                  saveData: addTask
                };
                updateModal(true, vals);
              }}
            >
              <img src={plusWhite} className="expandable" alt="plus" />
              add a new demo
            </div>
          </li>
        </div>
      </ul>
      {data.length > 10 && (
        <div className="m-3">
          <Pagination
            activePage={activePage}
            itemsCountPerPage={ITEMSPERPAGE}
            totalItemsCount={data.length}
            pageRangeDisplayed={5}
            onChange={changeactivePage}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </div>
  );
}

export default memo(List);
