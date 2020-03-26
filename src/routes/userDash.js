import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";

import Card from '../component/Card/Card';
import Exercise from './userExercises/exerciseList';
import Header from '../component/Header/Header';

export default () => {
    let match = useRouteMatch(); // Get current URL

    return (
        <Router>
            <Switch>
                <Route path={`${match.url}/exercisesList/:id`} render={(props) => <Exercise {...props} />} /> 
                <Route path="/">
                    <Header />
                    <Link to={`${match.url}/exercisesList/default`}>
                        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent:'center'}}>
                            <Card title="Testo Bucato" subtitle="Seleziona la risposta giusta" />
                        </div>
                    </Link>
                </Route>    
            </Switch>
           
        </Router>
    );
}