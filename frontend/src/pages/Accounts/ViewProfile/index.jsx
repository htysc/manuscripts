import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchFromBackend } from "../../../json";

const ViewProfile = () => {
  const context = useContext(APIContext);
  const {id} = useParams();
  const navigate = useNavigate();
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

  return <div className="main-container container">
    <div className="row justify-content-center">
      <h1 className="display-3 mb-4 text-center">My profile</h1>
      <p className="text-center m-2"><Link className="btn btn-primary" to={`/profile/${id}/edit`}>Edit profile</Link></p>
      <dl className="col-md-6 col-sm-9 m-2">
        {!!profile.username
          ? <div className="row">
            <dt className="col-sm-4">Username</dt>
            <dd className="col-sm-8">{profile.username}</dd>
          </div>
          : ''}
        {!!profile.email
          ? <div className="row">
            <dt className="col-sm-4">Email address</dt>
            <dd className="col-sm-8">{profile.email}</dd>
          </div>
          : ''}
        {!!profile.first_name || profile.last_name
          ? <div className="row">
            <dt className="col-sm-4">Name</dt>
            <dd className="col-sm-8">{profile.first_name} {profile.last_name}</dd>
          </div>
          : ''}
        {!!profile.date_joined
          ? <div className="row">
            <dt className="col-sm-4">Joined</dt>
            <dd className="col-sm-8">{(new Date(profile.date_joined)).toLocaleString()}</dd>
          </div>
          : ''}
      </dl>
      <p className="text-center m-2"><Link className="btn btn-primary" to={`/profile/${id}/edit`}>Edit profile</Link></p>
    </div>
  </div>;
}

export default ViewProfile;
