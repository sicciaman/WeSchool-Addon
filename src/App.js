import React, { useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import './App.css';

import MainCard from './component/MainCard/MainCard';
import Login from './component/Login/Login';
import UserCard from './component/UserCard/UserCard';
import ManageCard from './component/ManageCard/ManageCard';
import PrivateRoute from "./component/PrivateRoute/PrivateRoute";
import { AuthProvider } from "./component/Auth/Auth";

import { LogoutOutlined, LoginOutlined, RobotFilled } from '@ant-design/icons';
import app from './firebase';


export default function App() {
  const [user, setUser] = useState(null);
  
  
  useEffect(() => {
    document.title = "WeSchool Addon" // Change app title showed in Browser tab
    let root = document.getElementById('root');
    root.style.height = '100vh';
    root.style.backgroundColor = '#2b2924'
    app.auth().onAuthStateChanged(setUser); // Check for user auth state
  }, [])

  return (
    <AuthProvider>
      <Router>
        <div style={{fontFamily: 'Nunito Sans, sans-serif'}}>      
          <Switch>
            <Route path="/userDash" component={UserCard} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/manageDash" component={ManageCard} />

            <Route path="/">
              <div style={{paddingTop: 20, textAlign: 'right', fontWeight: 'lighter'}}>
                    { user ? (
                        <div style={{marginRight: 20}}>
                          <div style={{color: '#FEFEFF'}}>
                            <span style={{marginRight: 10}}>{user.email}</span>
                            <span><RobotFilled style={{fontSize: 20}} /></span>
                          </div>
                          <div onClick={() => app.auth().signOut()} style={{cursor: 'pointer', color: '#FE654F', fontSize: 25}}>
                                <LogoutOutlined/> Esci
                          </div>
                        </div>
                      ) : (
                        <div style={{cursor: 'pointer', fontSize: 25, marginRight: 20}}>
                          <Link to="/login" style={{color: '#FE654F'}}>
                            <LoginOutlined /> Login
                          </Link>
                        </div>
                      )
                    }
              </div>
              <div style={{position: "fixed", bottom: 80, top: 80, right: 0, left: 0, textAlign: 'center'}}> 
                <div style={{position: 'absolute', left: 0, right: 0, top:0, bottom:0, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                  <div style={{maxWidth: '100%'}}>
                    <div
                      style={{
                        fontSize: '3.5vw', 
                        fontWeight: 'lighter', 
                        color: '#FEFEFF', 
                      }}>
                      Benvenuto!
                    </div> 
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                      <Link to="/userDash">
                        <MainCard title="Dashboard" subtitle="Visualizza tutti gli esercizi" dash={true} />
                      </Link>
                      <Link to="/manageDash">
                        <MainCard title="Gestisci" subtitle="Crea o gestisci gli esercizi" dash={false} />
                      </Link>  
                    </div>
                  </div>
                </div>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

