import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../firebase';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams} from "react-router-dom";

import config from '../../utility/config';
import Header from '../../component/Header/Header';
import Card from '../../component/Card/Card';
import SelectOptionsOnFullText from './selectOptionsOnFullText';
import { AuthContext } from "../../component/Auth/Auth";

import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';

let userID = '';

export default () => {
    const [cards, setCards] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const {currentUser} = useContext(AuthContext);
    let match = useRouteMatch(); // Get current URL
    let {id} = useParams(); // ID of User for create custom link to share to have access to exercise without login

    // Get exercise list
    const fetchCards = () => {
            let ex = firebase.database().ref('selectBoxOnText/' + userID);
            ex
                .once('value')
                .then(async (snapshot) => {
                    let res = await snapshot.val();
                    if(res) {                   
                        let c = Object.values(res);
                        let keys = Object.keys(res);
                        c.forEach((card, i) => {
                            card.ID = parseInt(keys[i].substring(2));
                        });  
                        setCards(c);
                        setLoaded(true);
                    }
                });
    }

    useEffect(() => {
        if(currentUser) { // If user authenticated, load exercises
            userID = currentUser.uid;
            fetchCards()
        }          
    }, [])
    
    // Copy custom link to clipboard
    const copyLink = (ID) => {
        navigator.clipboard.writeText(config.hostingURL + match.url.substring(0,match.url.length - 7) + userID + '/exercise/' + ID);
        message.success('Link copiato correttamente!');
    }
    
    return (
        <Router>
            <Switch>
                <Route path={`${match.url}/exercise/:id`} render={(props) => <SelectOptionsOnFullText id={id} user={userID} {...props} />} />
                <Route path="/">
                    <Header />
                    <div> 
                        <div style={{paddingTop:100, display: 'flex', flexWrap: 'wrap'}}>
                        {
                            loaded && cards.map((card, i) => {
                                return(
                                    <div key={i} style={{position: 'relative', justifyContent:'center'}}>
                                        <Link  to={`${match.url}/exercise/${card.ID}`}>
                                            <Card title={card.exTitle} subtitle={card.textArea} />              
                                        </Link>
                                        <CopyOutlined
                                            onClick={() => copyLink(card.ID)}
                                            style ={{position: 'absolute', boxShadow: '2px 2px 2px #000', fontSize: 30, margin: 5, padding: 5, top: 8, right: 40, color: '#fe654f', borderRadius: 40, backgroundColor: 'white', cursor: 'pointer'}} 
                                        />
                                    </div>
                                );
                            })
                        }
                        </div>
                    </div>
                </Route>    
            </Switch>         
        </Router>
    );
}