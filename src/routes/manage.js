import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";

import Card from '../component/Card/Card';
import ExercisesList from './manageExercises/exercisesList';


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
                            <Card title="Testo Bucato" subtitle="Dà la possibilità di inserire un testo con opzioni di completamento" />
                        </div>
                    </Link>
                </Route>    
            </Switch>
           
        </Router>
    );
}