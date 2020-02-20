import React, { useRef, useState } from "react";
import "./Modal.css";
export default function Modal({ handleClose, data }) {
  let { title, desc, key, saveData } = data;
  let titleInput = useFormInput(title || "");
  let descInput = useFormInput(desc || "");
  let save = () => {
    saveData(titleInput.value, descInput.value, key);
    handleClose();
  };
  return (
    <div className="modal display-block">
      <section className="modal-main">
        <div className="m-5 p-3 d-flex flex-column">
          <p className="mx-auto font-weight-bold">TO-DO</p>
          <input
            className="m-3 px-3 py-1"
            type="text"
            {...titleInput}
            placeholder="Title"
          />
          <textarea
            className="m-3 px-3 py-2"
            {...descInput}
            placeholder="Description"
          ></textarea>
          <div className="mx-auto d-flex">
            <button className="mx-2 btn btn-success px-4 py-1" onClick={save}>
              Save
            </button>
            <button
              className="mx-2 btn btn-danger px-4 py-1"
              onClick={handleClose}
            >
              close
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function useFormInput(v) {
  let [value, change] = useState(v);
  let onChange = e => change(e.target.value);
  return { value, onChange };
}
