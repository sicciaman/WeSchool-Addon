import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";

import Card from '../component/Card/Card';
import ExercisesList from './manageExercises/exercisesList';

import cheese from '../utility/images/cheese.png';


export default () => {
    let match = useRouteMatch(); // Get current URL
    
    return (
        <Router>
            <Switch>
                <Route path={`${match.url}/selectBoxOnText`}>
                    <ExercisesList />
                </Route>
                <Route path="/">
                    <Link to={`${match.url}/selectBoxOnText`}>
                        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent:'center'}}>
                            <Card title="Testo Bucato" subtitle="Testo con opzioni di completamento" icon={cheese} />
                        </div>
                    </Link>
                </Route>    
            </Switch>
           
        </Router>
    );
}