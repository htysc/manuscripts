import React, { useContext, useEffect } from 'react';
import { defaultContext, APIContext } from "../../../contexts/APIContext";
import { Navigate } from 'react-router-dom';

const Logout = () => {
  const context = useContext(APIContext);

  useEffect(() => {
    context.update(defaultContext);
  }, [context]);

  return (
    <Navigate to="/" />
  );
};

export default Logout;
