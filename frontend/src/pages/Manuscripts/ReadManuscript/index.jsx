import React, { useState, useContext, useEffect, useMemo } from 'react';
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate, useSearchParams, Link, useParams } from 'react-router-dom';
import { fetchFromBackend } from '../../../json';
import DeleteManuscriptButton from '../../../components/Manuscripts/DeleteManuscriptButton';
import './style.css';

const ReadManuscript = () => {
  const context = useContext(APIContext);
  const {id} = useParams();
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
    if (!searchParams.has("print")) {
      fetchFromBackend(`/manuscripts/${id}/pages/?limit=10&offset=${(query.page - 1) * 10}`, {
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
        setPages(json.results);
        setTotalPages(Math.ceil(json.count / 10));
      });
    } else {
      fetchFromBackend(`/manuscripts/${id}/pages/`, {
        headers: {
          Authorization: 'Bearer ' + context.token
        }
      }, navigate)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return [];
        }
      })
      .then(json => {
        setPages(json);
        setTotalPages(1);
      });
    }
  }, [context, id, query, searchParams, navigate]);

  useEffect(() => {
    if (!!totalPages && pages.length === 0) {
      setSearchParams({...query, page: 1});
      setTotalPages(1);
    }
  }, [totalPages, pages, query, setSearchParams]);

  const printPage = () => {
    const toPrint = window.open(`/manuscripts/${id}/?print`, 'Print', 'popup=true');
    toPrint.addEventListener('afterprint', () => {
      toPrint.close();
    }, true);
  }

  useEffect(() => {
    if (pages.length > 0 && searchParams.has("print")) {
      window.print();
    }
  }, [pages, searchParams])

  return <div className="main-container container">
    <div className="row text-center">
      <h1 className="display-3 mb-4"><span>{manuscript.title}</span></h1>
      {pages.length > 0
        ? <>
          <p><Link className="btn btn-primary" to={`/manuscripts/${id}/edit?page=${query.page}`}>Edit this manuscript</Link></p>
          <p className="m-0"><button className="btn btn-primary" onClick={printPage}>Print this manuscript</button></p>
          <div className="page-container container p-4">
            {pages.map((page, idx) => {
              return <div key={idx} className="manuscript-page row p-3 m-2 border border-dark rounded">
                <div className="col-sm-12 p-2">
                  <p className="m-0">{ page.number }</p>
                </div>
                <div className="col-sm p-2">
                  <p className='manuscript-text'>{ page.text1 }</p>
                </div>
                <div className="col-sm p-2">
                  <p className='manuscript-text'>{ page.text2 }</p>
                </div>
                <div className="col-sm p-2">
                  {!!page.image
                    ? <img src={page.image} alt={`Page ${page.number}`} />
                    : <p className="text-danger">No image.</p>}
                </div>
              </div>;
            })}
            <div className="pagination-indicator d-sm-flex justify-content-between">
              {query.page > 1 
                ? <button className='btn btn-secondary mt-3' onClick={() => setSearchParams({...query, page: query.page - 1})}>Previous</button>
                : <button className="invisible" /> }
              {query.page < totalPages
                ? <button className='btn btn-secondary mt-3' onClick={() => setSearchParams({...query, page: query.page + 1})}>Next</button>
                : <button className="invisible" /> }
            </div>
            <p className='pagination-indicator mt-2 text-center'>Page {query.page} out of {totalPages || 1}</p>
          </div>
        </>
        : ''}
      <p><Link className="btn btn-primary" to={`/manuscripts/${id}/edit?page=${query.page}`}>Edit this manuscript</Link></p>
      <p><button className="btn btn-primary" onClick={printPage}>Print this manuscript</button></p>
      <DeleteManuscriptButton id={id} />
    </div>
  </div>;
};

export default ReadManuscript;
