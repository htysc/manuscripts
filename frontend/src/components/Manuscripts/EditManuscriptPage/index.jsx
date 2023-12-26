import React, { useContext, useRef, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate } from "react-router-dom";
import '../style.css';
import { fetchFromBackend } from "../../../json";

const EditManuscriptPage = ({manuscriptId, page, pages, setPages}) => {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const context = useContext(APIContext);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showDeletionSuccess, setShowDeletionSuccess] = useState(false);
  const [deletionError, setDeletionError] = useState(null);
  const navigate = useNavigate();

  const onSave = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    if (!!page.image?.file) {
      formData.append('image', page.image.file)
    }

    fetchFromBackend(`/manuscripts/${manuscriptId}/pages/${page.id}/`, {
      method: "PUT",
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
          setShowSaveSuccess(false);
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

  const onDelete = e => {
    e.preventDefault();

    if (!window.confirm('Are you sure? Deletion is irreversible.')) {
      return;
    }

    fetchFromBackend(`/manuscripts/${manuscriptId}/pages/${page.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: 'Bearer ' + context.token
      }
    }, navigate)
    .then(async response => {
      if (response.ok) {
        setShowDeletionSuccess(true);
        setDeletionError(null);
        setTimeout(() => {
          navigate(0);
        }, "1000"); 
      } else {
        return Promise.reject(await response.json());
      }
    })
    .catch(err => {
      console.log(err)
      setDeletionError(Object.values(err)?.[0] || 'An unknown error occurred. Please try again.');
    });
  }

  const setTextHeight = (textRef) => {
    textRef.current.style.height = "";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }

  text1Ref.current?.dispatchEvent(new Event('input', {bubbles: true})); // Force resize
  text2Ref.current?.dispatchEvent(new Event('input', {bubbles: true})); // Force resize

  return <form className="row p-3 m-2 border border-dark rounded" onSubmit={e => onSave(e)} encType="multipart/form-data">
    <div className="row justify-content-center">
      <div className="col-sm-2 p-2">
        <input type="number" className="form-control" name="number" id={`number_${page.number}`} placeholder='Page #' defaultValue={page.number} min="0" required />
      </div>
    </div>
    <div className="row justify-content-center">
      <div className="col-sm p-2">
        <textarea className="form-control" name="text1" id={`text1_${page.number}`} placeholder="Text" defaultValue={page.text1} ref={text1Ref} onInput={() => setTextHeight(text1Ref)} required />
      </div>
      <div className="col-sm p-2">
        <textarea className="form-control" name="text2" id={`text2_${page.number}`} placeholder="Text" defaultValue={page.text2} ref={text2Ref} onInput={() => setTextHeight(text2Ref)} required />
      </div>
      <div className="col-sm p-2">
        {!!page.image?.url
          ? <img src={page.image.url} alt={`Page ${page.number}`} />
          : <p className="text-danger m-0 border border-bottom-0 rounded rounded-bottom-0">No image.</p>}
        <input type="file" className="form-control rounded-top-0" name="image" id={`image_${page.number}`} accept="image/*" onChange={e => {
          setPages(pages.map(original => original.id !== page.id ? original : ({...original, image: {file: e.target.files[0], url: URL.createObjectURL(e.target.files[0])}})))
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
    {showDeletionSuccess
      ? <div className="alert alert-success" role="alert">
        <p className="m-0">Deletion was successful.</p>
      </div>
      : ''}
    {!!deletionError
      ? <div className="alert alert-danger" role="alert">
        <p className="m-0">{deletionError}</p>
      </div>
      : ''}
    <div className="d-flex flex-sm-row flex-column justify-content-center">
      <button className="btn btn-primary m-2" type="submit">Save</button>
      <button className="btn btn-danger m-2" type="submit" onClick={onDelete}>Delete</button>
    </div>
  </form>;
}

export default EditManuscriptPage;
