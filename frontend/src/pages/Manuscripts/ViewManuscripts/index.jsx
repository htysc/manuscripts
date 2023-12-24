import React, { useState, useContext, useEffect, useMemo } from 'react';
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchFromBackend } from '../../../json';

const ViewManuscripts = () => {
  const context = useContext(APIContext);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [manuscripts, setManuscripts] = useState([]);
  
  const query = useMemo(() => ({
    page : parseInt(searchParams.get("page") ?? 1),
  }), [searchParams]);

  useEffect(() => {
    fetchFromBackend(`/manuscripts/?page=${query.page}`, {
      headers: {
        Authorization: 'Bearer ' + context.token
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        if (parseInt(searchParams.get('page')) !== 1) {
          if (!totalPages || totalPages === 1) {
            setSearchParams({...query, page: 1});
          } else {
            setSearchParams({...query, page: query.page - 1});
          }
        }
        return {results: [], count: 1};
      }
    })
    .then(json => {
      setManuscripts(json.results);
      setTotalPages(Math.ceil(json.count / 10));
    });
  }, [context, query]);

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetchFromBackend('/manuscripts/', {
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + context.token
      },
      body: formData
    })
    .then(async response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(await response.json());
      }
    })
    .then(() => {
      setShowSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate(0);
      }, "1000");
    })
    .catch(err => {
      setError(Object.values(err)?.[0]?.[0] || 'An unknown error occurred. Please try again.');
    });
  };

  return <div className="container">
    <div className="row text-center">
      <h1 className="display-3 mb-4">My manuscripts</h1>
      {manuscripts.map((manuscript, idx) => <p key={idx}>
          <Link className="btn btn-outline-primary" to={`/manuscripts/${manuscript.id}`}>{manuscript.title}</Link>
        </p>
      )}
      <div className="border border-success rounded-3 p-3 mt-5">
        <p className="h3 mb-3">Create a manuscript</p>
        {showSuccess
          ? <div className="alert alert-success" role="alert">
            <p className="m-0">Success!</p>
          </div>
          : ''}
        {!!error
          ? <div className="alert alert-danger" role="alert">
            <p className="m-0">{error}</p>
          </div>
          : ''}
        <form className="container" onSubmit={onSubmit}>
          <div className="form-group row my-1">
            <label htmlFor="title" className="col-md-3 col-lg-2 col-form-label">Title</label>
            <div className="col-md-9 col-lg-10">
              <input type="text" className="form-control" name="title" id="title" placeholder="Enter title" required />
            </div>
          </div>
          <div className="form-group text-center my-3">
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>;
};

export default ViewManuscripts;
