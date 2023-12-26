import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromBackend } from '../../../json';

const Register = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('')

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetchFromBackend('/accounts/', {
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
    .then(() => {
      setShowSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate('/login');
      }, "1000");
    })
    .catch(err => {
      setError(Object.values(err)?.[0]?.[0] || 'An unknown error occurred. Please try again.');
    });
  };

  return <div className="container">
    <div className="row">
      <h1 className="display-3 mb-5 text-center">Register</h1>
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
          <label htmlFor="email" className="col-md-3 col-lg-2 col-form-label">Email address</label>
          <div className="col-md-9 col-lg-10">
            <input type="email" className="form-control" name="email" id="email" placeholder="Enter email address" />
          </div>
        </div>
        <div className="form-group row my-1">
          <label htmlFor="first_name" className="col-md-3 col-lg-2 col-form-label">First name</label>
          <div className="col-md-9 col-lg-10">
            <input type="text" className="form-control" name="first_name" id="first_name" placeholder="Enter first name" />
          </div>
        </div>
        <div className="form-group row my-1">
          <label htmlFor="last_name" className="col-md-3 col-lg-2 col-form-label">Last name</label>
          <div className="col-md-9 col-lg-10">
            <input type="text" className="form-control" name="last_name" id="last_name" placeholder="Enter last name" />
          </div>
        </div>
        <div className="form-group row my-1">
          <label htmlFor="password" className="col-md-3 col-lg-2 col-form-label">Password</label>
          <div className="col-md-9 col-lg-10">
            <input type="password" className="form-control" name="password" id="password" placeholder="Enter password" required onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="form-group row my-1">
          <label htmlFor="password2" className="col-md-3 col-lg-2 col-form-label">Confirm password</label>
          <div className="col-md-9 col-lg-10">
            <input type="password" className="form-control" name="password2" id="password2" placeholder="Repeat password" required onChange={e => e.target.value !== password ? e.target.setCustomValidity("Passwords don't match") : e.target.setCustomValidity("")} />
          </div>
        </div>
        <div className="form-group text-center my-2">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  </div>;
};

export default Register;
