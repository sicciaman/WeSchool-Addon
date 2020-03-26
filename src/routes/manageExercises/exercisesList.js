import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../firebase';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";

import Card from '../../component/Card/Card';
import SelectBoxOnText from './selectBoxOnText';
import Results from './showResults';
import { DeleteOutlined, PlusCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { Popconfirm, message } from 'antd';
import { AuthContext } from "../../component/Auth/Auth";

export default () => {
    const [cards, setCards] = useState([]); // List of exercises
    const [lastCardID, setLastCardID] = useState(0); // ID of the last Exercise
    const [loaded, setLoaded] = useState(false); // Boolean flag for updating status of data
    const {currentUser} = useContext(AuthContext); // Get current user logged
    let match = useRouteMatch();


    const fetchCards = () => {
        try {
            let ex = firebase.database().ref('selectBoxOnText/' + currentUser.uid); // Get all exercises of current user by his ID
            ex
                .once('value')
                .then(async (snapshot) => {
                    let res = await snapshot.val();
                    if(res) {
                        
                        let c = Object.values(res);
                        let keys = Object.keys(res);
                        c.forEach((card, i) => {
                            card.ID = parseInt(keys[i].substring(2)); // Cut part of string "ex" and take the ID2
                        });  
                        setCards(c); // Save Exercise in Card state    
                        setLastCardID(parseInt(keys[keys.length-1].substring(2))); // Set ID of last card
                    }
                }); 
                setLoaded(true);
        } catch (err) {
            console.error(err);
        }        
    }

    // Remove exercise by ID
    const removeExercise = (ID) => {
        try {
            firebase.database()
            .ref('/selectBoxOnText/' + currentUser.uid) 
            .child('ex' + ID) 
            .remove()
            .then(() => {
                let newCardsList = [];
                cards.map((card) => {
                    if(card.ID !== ID) // Exclude removed exercise
                        newCardsList.push(card);
                });
                setCards(newCardsList); // Update current exercises
                message.success('Esercizio rimosso correttamente!');
            })
        } catch (err) {
            console.error(err);
            message.error('Abbiamo incontrato un problema...Riprova!');
        }

    }

    useEffect(() => {
        if(currentUser) // If user authenticated, load exercises
            fetchCards();
    }, [])

    

    
    return (
        <Router>
            <Switch>
                <Route path={`${match.url}/exercise/:id`} render={(props) => <SelectBoxOnText user={currentUser.uid} newEx={false} {...props} />} />
                <Route path={`${match.url}/newExercise/:id`} render={(props) => <SelectBoxOnText user={currentUser.uid} newEx={true} {...props} />} />
                <Route path={`${match.url}/results/:id`} render={(props) => <Results user={currentUser.uid} {...props} />} />
                <Route path="/">
                    <div style={{position: 'relative'}}>
                        {
                            loaded &&
                            <div style={{position: 'fixed', right: 4, top: 100, color: '#1890ff', textAlign: 'center'}}>
                                <Link to={`${match.url}/newExercise/${lastCardID+1}`}>
                                    <span>
                                        <PlusCircleOutlined 
                                            style={{fontSize: 45}}    
                                        />
                                        <p>Nuovo Esercizio</p>
                                    </span>
                                </Link>
                            </div>
                        }     
                        <div style={{paddingTop:80, display: 'flex', flexWrap: 'wrap'}}>
                        {
                            loaded && cards.map((card, i) => {
                                return(
                                    <div key={i} style={{position: 'relative', justifyContent:'center'}}>
                                        <Link to={`${match.url}/exercise/${card.ID}`}>
                                            <Card title={card.exTitle} subtitle={card.textArea} />              
                                        </Link>
                                        <Link to={`${match.url}/results/${card.ID}`}>
                                            <BarChartOutlined 
                                                style ={{position: 'absolute', fontSize: 37, margin: 5, top: 0, left: 30, color: '#1890ff', backgroundColor: 'white', cursor: 'pointer'}} 
                                            />
                                        </Link>
                                        <Popconfirm
                                            title="Sei sicuro di voler eliminare l'esercizio?"
                                            onConfirm={() => removeExercise(card.ID)}
                                            okText="Si"
                                            cancelText="No"
                                        >
                                            <DeleteOutlined  
                                                style ={{position: 'absolute', fontSize: 25, margin: 5, top: 13, right: 30, color: 'red', backgroundColor: 'white', cursor: 'pointer'}} 
                                            />
                                        </Popconfirm>
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