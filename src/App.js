import React, { useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './App.css';

import Card from './component/Card/Card';
import Login from './component/Login/Login';
import UserCard from './component/UserCard/UserCard';
import ManageCard from './component/ManageCard/ManageCard';
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./component/Auth/Auth";

import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import app from './firebase';


export default function App() {
  const [user, setUser] = useState(null);
  
  
  useEffect(() => {
    document.title = "WeSchool Addon" // Change app title showed in Browser tab
    app.auth().onAuthStateChanged(setUser); // Check for user auth state
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div>      
          <Switch>
            <Route path="/userDash" component={UserCard} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/manageDash" component={ManageCard} />

            <Route path="/">
              <div style={{position: 'absolute', textAlign: 'center', right: 20, top: 20}}>
                { user ? (
                  <>
                    <div>Benvenuto</div>
                    <div onClick={() => app.auth().signOut()} style={{cursor: 'pointer', color: '#0377fc', fontSize: 30}}>
                          <LogoutOutlined/> Esci
                    </div>
                  </>
                  ) : (
                    <div style={{cursor: 'pointer', color: '#0377fc', fontSize: 30}}>
                      <Link to="/login">
                        <LoginOutlined /> Login
                      </Link>
                  </div>
                  )
                }
              </div>  
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center', paddingTop: 100}}>
                <Link to="/userDash">
                    <Card title="Dashboard Esercizi" subtitle="Visualizza tutti gli esercizi ed inizia..." />
                </Link>
                <Link to="/manageDash">
                    <Card title="Gestisci Esercizi" subtitle="Organizza e imposta il lavoro di ogni singolo esercizio..." />
                </Link>  
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

