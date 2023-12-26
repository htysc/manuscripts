import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFromBackend } from "../../../json";
import { APIContext } from "../../../contexts/APIContext";

const DeleteManuscriptButton = ({id}) => {
  const context = useContext(APIContext);
  const [showDeletionSuccess, setShowDeletionSuccess] = useState(false);
  const [deletionError, setDeletionError] = useState(null);
  const navigate = useNavigate();

  const onDelete = e => {
    e.preventDefault();

    if (!window.confirm('Are you sure? Deletion is irreversible.')) {
      return;
    }

    fetchFromBackend(`/manuscripts/${id}/`, {
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
          navigate("/");
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

  return <>
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
    <form className="form-inline" onSubmit={onDelete}>
      <button className="btn btn-danger" type="submit">Delete this manuscript</button>
    </form>
  </>;
}

export default DeleteManuscriptButton;
