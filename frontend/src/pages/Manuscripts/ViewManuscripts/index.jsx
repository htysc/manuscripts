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
  const [totalPages, setTotalPages] = useState(0);
  const [manuscripts, setManuscripts] = useState([]);
  
  const query = useMemo(() => ({
    page : parseInt(searchParams.get("page") ?? 1),
  }), [searchParams]);

  useEffect(() => {
    fetchFromBackend(`/manuscripts/?page=${query.page}`, {
      headers: {
        Authorization: 'Bearer ' + context.token
      }
    }, navigate)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return {results: [], count: 1};
      }
    })
    .then(json => {
      setManuscripts(json.results);
      setTotalPages(Math.ceil(json.count / 10));
    });
  }, [context, query, navigate]);

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetchFromBackend('/manuscripts/', {
      method: "POST",
      headers: {
        Authorization: 'Bearer ' + context.token
      },
      body: formData
    }, navigate)
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

  useEffect(() => {
    if (!!totalPages && manuscripts.length === 0) {
      setSearchParams({...query, page: 1});
      setTotalPages(1);
    }
  }, [totalPages, manuscripts, query, setSearchParams]);

  return <div className="container">
    <div className="row text-center justify-content-center">
      <h1 className="display-3 mb-4">My manuscripts</h1>
      {manuscripts.map((manuscript, idx) => <p key={idx}>
          <Link className="btn btn-outline-primary" to={`/manuscripts/${manuscript.id}`}>{manuscript.title}</Link>
        </p>
      )}
      <div className="col col-sm-6 d-flex justify-content-between">
        {query.page > 1 
          ? <button className='btn btn-secondary mt-3' onClick={() => setSearchParams({...query, page: query.page - 1})}>Previous</button>
          : <button className="invisible" /> }
        {query.page < totalPages
          ? <button className='btn btn-secondary mt-3' onClick={() => setSearchParams({...query, page: query.page + 1})}>Next</button>
          : <button className="invisible" /> }
      </div>
      <p className='mt-2 text-center'>Page {query.page} out of {totalPages || 1}</p>
      <div className="col col-sm-6 border border-success rounded-3 p-3 mt-5">
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
