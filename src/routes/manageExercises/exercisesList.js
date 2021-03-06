import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../firebase';
import {BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";

import Card from '../../component/Card/Card';
import SelectBoxOnText from './selectBoxOnText';
import Results from './showResults';
import { DeleteOutlined, PlusCircleOutlined, BarChartOutlined} from '@ant-design/icons';
import { Popconfirm, message, Button } from 'antd';
import { AuthContext } from "../../component/Auth/Auth";

import edit from '../../utility/images/edit.png';

const defaultButton = {
    color: '#fff',
    backgroundImage: 'linear-gradient(to right top, #faad148f, #ff7875, #ff4d4f, rgb(254, 101, 79))',
    border: 'none',
    fontSize: '1.5em',
    width: 250,
    height: 55,
    fontWeight: 'bold'
}

const activeButton = {
    color: '#fff',
    backgroundImage: 'linear-gradient(to right top, #faad148f, #ff7875, #ff4d4f, rgb(254, 101, 79))',
    border: 'none',
    fontSize: '1.5em',
    width: 270,
    height: 60,
    fontWeight: 'bold'
}

export default () => {
    const [cards, setCards] = useState([]); // List of exercises
    const [lastCardID, setLastCardID] = useState(0); // ID of the last Exercise
    const [loaded, setLoaded] = useState(false); // Boolean flag for updating status of data
    const [addExerciseButton, setAddExerciseButton] = useState(false);
    const {currentUser} = useContext(AuthContext); // Get current user logged
    let match = useRouteMatch();

    const sortId = (prev, next) => {
        return prev - next;
    }

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
                        let numericalKeys = [];
                        c.forEach((card, i) => {
                            card.ID = parseInt(keys[i].substring(2)); // Cut part of string "ex" and take the ID2
                            numericalKeys.push(card.ID)
                        }); 
                        console.log(numericalKeys) 
                        numericalKeys.sort(sortId);
                        console.log(numericalKeys) 
                        setCards(c); // Save Exercise in Card state    
                        setLastCardID(numericalKeys[keys.length-1]); // Set ID of last card
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
                        <div style={{paddingTop:80, marginBottom: 100, display: 'flex', flexWrap: 'wrap'}}>
                        {
                            loaded && cards.map((card, i) => {
                                return(
                                    <div key={i} style={{position: 'relative', justifyContent:'center'}}>
                                        <Link to={`${match.url}/exercise/${card.ID}`}>
                                            <Card title={card.exTitle} subtitle={card.textArea} icon={edit} />              
                                        </Link>
                                        <Link to={`${match.url}/results/${card.ID}`}>
                                            <BarChartOutlined 
                                                style ={{position: 'absolute', boxShadow: '2px 2px 2px #000', fontSize: 30, margin: 5, padding: 8, top: 0, left: 30, color: '#fff', backgroundColor: '#fe654f', borderRadius: 40, cursor: 'pointer'}} 
                                            />
                                        </Link>
                                        <Popconfirm
                                            title="Sei sicuro di voler eliminare l'esercizio?"
                                            onConfirm={() => removeExercise(card.ID)}
                                            okText="Si"
                                            cancelText="No"
                                        >
                                            <DeleteOutlined  
                                                style ={{position: 'absolute', boxShadow: '2px 2px 2px #000', fontSize: 22, margin: 5, padding: 5, top: 6, right: 30, color: '#fe654f', backgroundColor: 'white', borderRadius: 40, cursor: 'pointer'}} 
                                            />
                                        </Popconfirm>
                                    </div>
                                );
                            })
                        }
                        </div>              
                        {   
                            loaded && 
                            <div               
                                style={{position: 'fixed', bottom: 0, height: 100, padding: 25, width: '100%', backgroundImage: 'linear-gradient(to top, #2b2924, #2b2924, #2b2924, #2b2924d9)'}}
                            >
                                <Link 
                                    style={{color: '#fe654f'}}
                                    to={`${match.url}/newExercise/${lastCardID+1}`}
                                >
                                    <Button
                                        onMouseEnter={() => setAddExerciseButton(true)}
                                        onMouseLeave={() => setAddExerciseButton(false)}
                                        style={addExerciseButton ?  activeButton : defaultButton}                               
                                    >
                                        Aggiungi Esercizio
                                    </Button>
                                </Link>
                            </div>
                        }   
                    </div>
                </Route>    
            </Switch>        
        </Router>
    );
}