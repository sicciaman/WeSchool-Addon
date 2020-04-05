import React from 'react';
import firebase from '../../firebase';
import { Button, message } from 'antd';

import InputText from '../../component/InputText/InputText';

export default class selectOptionOnFullText extends React.Component {
    pieces = []; // Array of string generated from split functions based on position of & in text area
    opt = []; // Options array
    _userAnswers = []; 
    _rightAnswers = [];
    userRecap = {}; // User results of exercise
    name = '';
    surnamme = '';
    exID = 0;
    user = '';
    
    constructor(props) {
        super(props);

        this.state = {
            exTitle: '',
            text: '',
            blocks: [],
            opt: [],
            answers: [],
            load: false, // Loading exercise boolean
            endedTest: false, // Boolean that indicates user finished test
            requiredFields: false
        }

        this.setName = this.setName.bind(this);
        this.setSurname = this.setSurname.bind(this);
    }
    
    componentDidMount= () => {
        this.exID = this.props.match.params.id; // Get exercise ID from URL
        this.user = this.props.user || this.props.id; // User ID assigned when user is authenticated or userID passed by url without auth

        // Get exercise title
        const exTitle = firebase.database().ref('selectBoxOnText/' + this.user + '/ex' + this.exID + '/exTitle');
        exTitle.once('value', (snapshot) => {
            this.setState({exTitle: snapshot.val()});
        }); 

        // Get exercise text
        const text = firebase.database().ref('selectBoxOnText/' + this.user + '/ex' + this.exID + '/textArea');
        text.once('value', (snapshot) => {
            this.setState({text: snapshot.val()}, this.checkOptions)
        }); 

        // Get exercise options
        const options = firebase.database().ref('selectBoxOnText/' + this.user + '/ex' + this.exID + '/options');
        options
            .once('value')
            .then(snapshot => snapshot.val())
            .then(value => {
                if(value) {
                    this.opt = [...value];
                    this.setState({opt: this.opt}, () => {
                        for(let i=0; i<this.pieces.length-1; i++) {
                            this._userAnswers.push(0) //Initialized answers array with default value
                            this._rightAnswers.push(this.state.opt[i].rightAnswer)
                        }
                    });
                }
            });

        this.setState({load: true});
    }

    setName = (e) => {
        this.name = e.target.value;
    }

    setSurname = (e) => {
        this.surname = e.target.value;
    }

    checkOptions = () => {
        this.pieces = this.state.text.split('&');
        let s = [];
        // Create array of strings splitted by position of &
        this.pieces.map(i => {
            s.push(i);
        });

        this.setState({
            blocks: s
        });  
    }

    handleChange = (e, index) => {
        this._userAnswers[index] = parseInt(e.target.value);
    }

    // Check if name and username fields compiled
    checkUser = () => {
        if (this.name && this.surname)
            return true;
        else 
            return false;
    }

    // Invoke when user click on finish test button
    endExercise = () => {
        if(this.checkUser()) {
            let correct = 0;
            let error = 0;

            // Compare user answers with right answers
            for(let i=0; i<this._rightAnswers.length; i++) {
                (this._userAnswers[i] === this._rightAnswers[i]) ? correct++ : error++;
            }
            console.log('Risposte corrette: ' + correct);
            console.log('Risposte errate: ' + error);
            
            this.userRecap = {
                'Utente': this.name + ' ' + this.surname,
                'Errori': error,
                'Giuste': correct,
            }

             
            // Push user result on Db
            try {
                firebase.database()
                    .ref("selectBoxOnText/" + this.user + '/ex' + this.exID + "/results/" + this.name + this.surname)
                    .update(this.userRecap);
                console.log("DATA SAVED");
                this.setState({endedTest: true});
            } catch(err) {
                message.error('Errore durante la consegna, riprova!');
            }
            
        } else {
            this.setState({requiredFields: true});
            message.error('Inserisci Nome e Cognome prima di poter consegnare!');
        }
    }

    render() {
        return(
            <div>
                {
                    this.state.endedTest ? 
                        (   
                            <>
                            <h2>Test Completato!</h2>
                            <hr style={{margin: 20}} />
                            <h4>Risposte CORRETTE:</h4> <p style={{fontSize: 50}}>{this.userRecap.Giuste}</p>
                            <h4>Risposte ERRATE:</h4> <p style={{fontSize: 50}}>{this.userRecap.Errori}</p>
                            </>
                        ) : (
                            <>
                            <div style={{display: "flex", padding: 20}}>
                                <InputText setField={this.setName} label="Nome" />
                                <InputText setField={this.setSurname} label="Cognome" />
                            </div>
                            <div style={{margin: 20, padding: 50}}>
                                <h2 
                                    style={{
                                        backgroundColor: 'white', 
                                        border: '1px solid #ccc', 
                                        borderRadius: 30, 
                                        boxShadow: '3px 3px 10px', 
                                        display: 'inline-block', 
                                        padding: 5}}
                                    >
                                        {this.state.exTitle}
                                    </h2>
                                <div style={{padding: 20, border: '1px solid #ccc', borderRadius: 15, boxShadow: '3px 3px 10px', margin: 'auto', minWidth: 300, maxWidth: 600, lineHeight: '70px', backgroundColor: 'white'}}>
                                    {
                                        !this.state.opt.length ? (<p>Loading . . .</p>) : null
                                    }
                                    {
                                        this.state.opt.length && this.state.load && this.state.blocks.map((block, i) => {                           
                                            return (
                                                <span key={i}>  
                                                    {block}
                                                    {
                                                        i===this.state.blocks.length-1 ? (
                                                            null
                                                        ) : (
                                                            <select placeholder="Seleziona" style={{margin: 5, fontWeight: 'bold'}} onChange={e => this.handleChange(e, i)} id="opt" name="opt">
                                                                <option value="" disabled selected> ~ Seleziona ~ </option>
                                                                <option style={{fontWeight: 'bold'}} value={1}>{this.state.opt[i].opt1}</option>
                                                                <option style={{fontWeight: 'bold'}} value={2}>{this.state.opt[i].opt2}</option>
                                                                <option style={{fontWeight: 'bold'}} value={3}>{this.state.opt[i].opt3}</option>
                                                            </select>
                                                        )
                                                    }   
                                                </span>
                                            )   
                                        })
                                    }
                                </div>
                                <Button onClick={this.endExercise} type="primary" style={{marginTop: 20}} >
                                    Consegna
                                </Button>
                            </div>
                            </>
                        )       
                }        
            </div>
        );
    }
}