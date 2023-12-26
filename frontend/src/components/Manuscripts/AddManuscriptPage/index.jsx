import React, { useContext, useRef, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate } from "react-router-dom";
import '../style.css';
import { fetchFromBackend } from "../../../json";

const AddManuscriptPage = ({manuscriptId, count, query, setSearchParams}) => {
  const textRef = useRef(null);
  const context = useContext(APIContext);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [image, setImage] = useState({});
  const navigate = useNavigate();

  const onSave = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    if (!!image.file) {
      formData.append('image', image.file)
    }

    fetchFromBackend(`/manuscripts/${manuscriptId}/pages/`, {
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + context.token
      },
      body: formData
    }, navigate)
    .then(async response => {
      if (response.ok) {
        setShowSaveSuccess(true);
        setSaveError(null);
        setTimeout(() => {
          if (count < 10) {
            navigate(0);
          } else {
            setSearchParams({...query, page: query.page + 1})
          }
        }, "1000"); 
      } else {
        return Promise.reject(await response.json());
      }
    })
    .catch(err => {
      console.log(err)
      setSaveError(Object.values(err)?.[0] || 'An unknown error occurred. Please try again.');
    });
  }

  const setTextHeight = () => {
    textRef.current.style.height = "";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }

  return <form className="row p-3 m-2 mt-0 border border-dark rounded" onSubmit={e => onSave(e)} encType="multipart/form-data">
    <div className="row justify-content-center">
      <div className="col-sm-2 p-2">
        <input type="number" className="form-control" name="number" id={`number_new`} placeholder='Page #' min="0" required />
      </div>
    </div>
    <div className="row justify-content-center">
      <div className="col-sm p-2">
        <textarea className="form-control" name="text" id={`text_new`} placeholder="Text" ref={textRef} onInput={setTextHeight} required />
      </div>
      <div className="col-sm p-2">
        {!!image.url
          ? <img src={image.url} alt="New page" />
          : <p className="text-danger m-0 border border-bottom-0 rounded rounded-bottom-0">No image.</p>}
        <input type="file" className="form-control rounded-top-0" id={`image_new`} accept="image/*" onChange={e => {
          setImage({file: e.target.files[0], url: URL.createObjectURL(e.target.files[0])})
          e.target.value = null;
        }} />
      </div>
    </div>
    {showSaveSuccess
      ? <div className="alert alert-success" role="alert">
        <p className="m-0">Saved</p>
      </div>
      : ''}
    {!!saveError
      ? <div className="alert alert-danger" role="alert">
        <p className="m-0">{saveError}</p>
      </div>
      : ''}
    <div className="d-flex flex-sm-row flex-column justify-content-center">
      <button className="btn btn-primary m-2" type="submit">Add a page</button>
    </div>
  </form>;
}

export default AddManuscriptPage;
