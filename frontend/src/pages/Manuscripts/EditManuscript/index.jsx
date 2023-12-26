import React, { useState, useContext, useEffect, useMemo } from 'react';
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { fetchFromBackend } from '../../../json';
import DeleteManuscriptButton from '../../../components/Manuscripts/DeleteManuscriptButton';
import EditManuscriptPage from '../../../components/Manuscripts/EditManuscriptPage';
import AddManuscriptPage from '../../../components/Manuscripts/AddManuscriptPage';

const EditManuscript = () => {
  const context = useContext(APIContext);
  const {id} = useParams();
  const [showSetTitleSuccess, setShowSetTitleSuccess] = useState(false);
  const [setTitleError, setSetTitleError] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const [manuscript, setManuscript] = useState({});
  const [pages, setPages] = useState([]);

  const query = useMemo(() => ({
    page : parseInt(searchParams.get("page") ?? 1),
  }), [searchParams]);

  useEffect(() => {
    fetchFromBackend(`/manuscripts/${id}/`, {
      headers: {
        Authorization: 'Bearer ' + context.token
      }
    }, navigate)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return {};
      }
    })
    .then(json => {
      setManuscript(json);
    });
  }, [context, id, navigate]);

  useEffect(() => {
    fetchFromBackend(`/manuscripts/${id}/pages/?page=${query.page}`, {
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
      setPages(json.results.map(page => ({...page, image: {url: page.image}})));
      setTotalPages(Math.ceil(json.count / 10) || 1);
    });
  }, [context, id, query, navigate]);

  const onSetTitle = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetchFromBackend(`/manuscripts/${id}/`, {
      method: "PUT",
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
      setShowSetTitleSuccess(true);
      setSetTitleError(null);
      setTimeout(() => {
        navigate(0);
      }, "1000");
    })
    .catch(err => {
      setSetTitleError(Object.values(err)?.[0]?.[0] || 'An unknown error occurred. Please try again.');
    });
  }

  useEffect(() => {
    if (!!totalPages && pages.length === 0) {
      setSearchParams({...query, page: 1});
      setTotalPages(1);
    }
  }, [totalPages, pages, query, setSearchParams]);

  return <div className="container">
    <div className="row text-center">
      {showSetTitleSuccess
        ? <div className="alert alert-success" role="alert">
          <p className="m-0">Success</p>
        </div>
        : ''}
      {!!setTitleError
        ? <div className="alert alert-danger" role="alert">
          <p className="m-0">{setTitleError}</p>
        </div>
        : ''}
      <form className="col col-sm-6 container mb-4" onSubmit={onSetTitle}>
        <div className="form-group row my-1">
          <label htmlFor="title" className="col-md-3 col-lg-2 col-form-label">Title</label>
          <div className="col-md-9 col-lg-10">
            <input type="text" className="form-control" name="title" id="title" defaultValue={manuscript.title} required />
          </div>
        </div>
        <div className="form-group text-center my-3">
          <button type="submit" className="btn btn-primary">Set title</button>
        </div>
      </form>
      {pages.length > 0
        ? <>
          <p className="m-0"><Link className="btn btn-primary" to={`/manuscripts/${id}/?page=${query.page}`}>Read this manuscript</Link></p>
          <div className="container pt-4 px-0">
            {pages.map((page, idx) => 
              <EditManuscriptPage manuscriptId={id} page={page} key={idx} pages={pages} setPages={setPages} />
            )}
          </div>
        </>
        : ''}
      {!query.page || query.page === totalPages
        ? <div className="container px-0">
            <AddManuscriptPage manuscriptId={id} count={pages.length} query={query} setSearchParams={setSearchParams} />
          </div>
        : ''}
      <div className="d-sm-flex justify-content-between">
        {query.page > 1 
          ? <button className='btn btn-secondary mt-3' onClick={() => setSearchParams({...query, page: query.page - 1})}>Previous</button>
          : <button className="invisible" /> }
        {query.page < totalPages
          ? <button className='btn btn-secondary mt-3' onClick={() => setSearchParams({...query, page: query.page + 1})}>Next</button>
          : <button className="invisible" /> }
      </div>
      <p className='mt-2 text-center'>Page {query.page} out of {totalPages || 1}</p>
      <p><Link className="btn btn-primary" to={`/manuscripts/${id}/?page=${query.page}`}>Read this manuscript</Link></p>
      <DeleteManuscriptButton id={id} />
    </div>
  </div>;
};

export default EditManuscript;
