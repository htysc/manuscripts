import React, { useState, useContext } from 'react';
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate } from 'react-router-dom';
import { fetchFromBackend } from '../../../json';

const Login = () => {
  const context = useContext(APIContext);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetchFromBackend('/accounts/login/', {
      method: "POST",
      body: formData
    }, navigate)
    .then(async response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(await response.json());
      }
    })
    .then(data => {
      const access = data.access;

      fetchFromBackend('/accounts/', {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + access
        }
      }, navigate)
      .then(async response => {
        if (response.ok) {
          return response.json()
        } else {
          return Promise.reject(await response.json());
        }
      })
      .then(data => {
        setShowSuccess(true);
        setError(null);

        setTimeout(() => {
          context.update({...data, token: access});
          navigate('/');
        }, "1000");
      })
      .catch(err => {
        setError(Object.values(err)?.[0] || 'An unknown error occurred. Please try again.');
        console.log(err);
      });
    })
    .catch(() => {
      setError('Username and password do not match. Please try again.');
    });
  };

  return <div className="container">
    <div className="row">
      <h1 className="display-3 mb-5 text-center">Log In</h1>
      {showSuccess
        ? <div className="alert alert-success" role="alert">
          <p className="m-0">Success! You will be redirected in one second.</p>
        </div>
        : ''}
      {!!error
        ? <div className="alert alert-danger" role="alert">
          <p className="m-0">{error}</p>
        </div>
        : ''}
      <form className="container" onSubmit={onSubmit}>
        <div className="form-group row my-1">
          <label htmlFor="username" className="col-md-3 col-lg-2 col-form-label">Username</label>
          <div className="col-md-9 col-lg-10">
            <input type="text" className="form-control" name="username" id="username" placeholder="Enter username" required />
          </div>
        </div>
        <div className="form-group row my-1">
          <label htmlFor="password" className="col-md-3 col-lg-2 col-form-label">Password</label>
          <div className="col-md-9 col-lg-10">
            <input type="password" className="form-control" name="password" id="password" placeholder="Enter password" required />
          </div>
        </div>
        <div className="form-group text-center my-2">
          <button type="submit" className="btn btn-primary">Log In</button>
        </div>
      </form>
    </div>
  </div>;
};

export default Login;
