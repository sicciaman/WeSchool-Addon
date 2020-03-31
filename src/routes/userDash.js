import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";

import Card from '../component/Card/Card';
import Exercise from './userExercises/exerciseList';
import Header from '../component/Header/Header';

import cheese from '../utility/images/cheese.png';

export default () => {
    let match = useRouteMatch(); // Get current URL

    return (
        <Router>
            <Switch>
                <Route path={`${match.url}/exercisesList/:id`} render={(props) => <Exercise {...props} />} /> 
                <Route path="/">
                    <Header />
                    <div style={{paddingTop: 80}}>
                        <Link to={`${match.url}/exercisesList/default`}>
                            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent:'center'}}>
                                <Card title="Testo Bucato" subtitle="Seleziona la risposta giusta" icon={cheese} />
                            </div>
                        </Link>
                    </div>                   
                </Route>    
            </Switch>
           
        </Router>
    );
}