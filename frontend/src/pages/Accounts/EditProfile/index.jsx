import { useContext, useEffect, useRef, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFromBackend } from "../../../json";

const EditProfile = () => {
  const context = useContext(APIContext);
  const {id} = useParams();
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchFromBackend(`/accounts/${id}/`, {
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
      setProfile(json);
    });
  }, [context, id, navigate]);

  const onSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);

    fetchFromBackend(`/accounts/${id}/`, {
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
      setShowSuccess(true);
      setError(null);
      setTimeout(() => {
        navigate(`/profile/${id}/`);
      }, "1000");
    })
    .catch(err => {
      setError(Object.values(err)?.[0]?.[0] || 'An unknown error occurred. Please try again.');
    });
  }

  const onPasswordChange = () => {
    if (passwordRef.current.value !== password2Ref.current.value) {
      passwordRef.current.setCustomValidity("Passwords don't match")
    } else {
      passwordRef.current.setCustomValidity("")
    }
  }

  return <div className="main-container container">
    <div className="row justify-content-center">
      <h1 className="display-3 mb-4 text-center">My profile</h1>
      {showSuccess
        ? <div className="alert alert-success" role="alert">
          <p className="m-0">Success</p>
        </div>
        : ''}
      {!!error
        ? <div className="alert alert-danger" role="alert">
          <p className="m-0">{error}</p>
        </div>
        : ''}
      <form className="row justify-content-center" onSubmit={onSubmit}>
        <dl className="col-md-6 col-sm-9 m-0">
          <div className="row align-items-center m-1">
            <dt className="col-sm-4">Username</dt>
            <dd className="col-sm-8 m-0"><input type="text" className="form-control" name="username" id="username" defaultValue={profile.username} required /></dd>
          </div>
          <div className="row align-items-center m-1">
            <dt className="col-sm-4">Email address</dt>
            <dd className="col-sm-8 m-0"><input type="email" className="form-control" name="email" id="email" defaultValue={profile.email} /></dd>
          </div>
          <div className="row align-items-center m-1">
            <dt className="col-sm-4">First name</dt>
            <dd className="col-sm-8 m-0"><input type="text" className="form-control" name="first_name" id="first_name" defaultValue={profile.first_name} /></dd>
          </div>
          <div className="row align-items-center m-1">
            <dt className="col-sm-4">Last name</dt>
            <dd className="col-sm-8 m-0"><input type="text" className="form-control" name="last_name" id="last_name" defaultValue={profile.last_name} /></dd>
          </div>
          <div className="row align-items-center m-1">
            <dt className="col-sm-4">Password</dt>
            <dd className="col-sm-8 m-0"><input type="password" ref={passwordRef} className="form-control" name="password" id="password" onChange={onPasswordChange} /></dd>
          </div>
          <div className="row align-items-center m-1">
            <dt className="col-sm-4">Confirm password</dt>
            <dd className="col-sm-8 m-0"><input type="password" ref={password2Ref} className="form-control" name="password2" id="password2" onChange={onPasswordChange} /></dd>
          </div>
          <div className="form-group text-center my-3">
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </dl>
      </form>
    </div>
  </div>;
}

export default EditProfile;
