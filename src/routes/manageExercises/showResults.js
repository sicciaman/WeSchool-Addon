import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import firebase from '../../firebase';

import { Table, message } from 'antd';

// Table columns structure
const columns = [
    {
      title: 'Alunno',
      dataIndex: 'name',
    },
    {
      title: 'Risposte Esatte',
      dataIndex: 'rightAnswers',
    },
    {
      title: 'Risposte Sbagliate',
      dataIndex: 'wrongAnswers',
    },
    {
      title: 'Punteggio (%)',
      dataIndex: 'rate',
      sorter: {
        compare: (a, b) => a.rate - b.rate,
      },
    },
];


export default ({user}) => {
    const [results, setResults] = useState([]);
    let {id} = useParams(); // Get exercise ID from URL params


    // Get exercise results from DB 
    const fetchResults = () => {
        try {
            let res = firebase.database().ref('selectBoxOnText/' + user + '/ex' + id + '/results');
            res
                .once('value')
                .then(async (snapshot) => {
                    let res = await snapshot.val();
                    if(res) {         
                        let temp_res = [];    
                        let keys = Object.keys(res);
                        keys.map((user, i) => { // Loop by keys (in this case keys are name+surname => es. MarioRossi)
                            let tot = res[user]["Giuste"] + res[user]["Errori"];
                            temp_res.push({
                                key: (i+1).toString(),
                                name: res[user]["Utente"],
                                rightAnswers: res[user]["Giuste"],
                                wrongAnswers: res[user]["Errori"],
                                rate: parseFloat((res[user]["Giuste"]*100)/tot).toFixed(2) // Calculate success ratio
                            });
                        })
                        setResults(temp_res); // Set status
                    }
                }); 
        } catch(err) {
            console.error(err);
            message.error('Abbiamo incontrato un problema durante caricamento dei risultati!');
        }
    }


    useEffect(() => {
        fetchResults();
    }, []);

    return(
        <div>
            <h1 style={{color: '#fff'}}>Risultati</h1>
            <Table 
                columns={columns} 
                dataSource={results} 
                bordered
                style={{minWidth: 400, margin: 70}}
            /> 
        </div>
    )
}