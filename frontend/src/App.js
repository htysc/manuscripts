import './App.css';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { defaultContext, APIContext, getContext } from './contexts/APIContext';
import NotLoggedInLayout from './components/NotLoggedInLayout';
import LoggedInLayout from './components/LoggedInLayout';
import Register from './pages/Accounts/Register';
import Login from './pages/Accounts/Login';
import Logout from './pages/Accounts/Logout';
import ViewManuscripts from './pages/Manuscripts/ViewManuscripts';
import ReadManuscript from './pages/Manuscripts/ReadManuscript';
import EditManuscript from './pages/Manuscripts/EditManuscript';
import NotFound from './pages/NotFound';

const Main = () => {
  const navigate = useNavigate();
  const [context, setContext] = useState({
    ...getContext(),
    update: newContext => {
      localStorage.setItem('userContext', JSON.stringify(newContext));
      setContext(state => ({...state, ...newContext}));
    },
    logout: () => {
      context.update(defaultContext);
      navigate('/');
    }
  });

  return <APIContext.Provider value={context}>
    <Routes>
      <Route path="/" element={context.username === '' ? <NotLoggedInLayout /> : <LoggedInLayout />}>
        <Route index element={context.username === '' ? <Navigate to="/register" replace={true} /> : <ViewManuscripts />} />
        {/* Accounts */}
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        {/* <Route path="profile/:id" element={<ViewProfile />} /> */}
        {/* <Route path="profile/:id/edit" element={<EditProfile />} /> */}
        {/* Manuscripts */}
        <Route path="manuscripts/:id" element={<ReadManuscript />} />
        <Route path="manuscripts/:id/edit" element={<EditManuscript />} />
        {/* General */}
        <Route path="logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </APIContext.Provider>;
}

function App() {
  return <BrowserRouter>
    <Main />
  </BrowserRouter>;
}

export default App;
