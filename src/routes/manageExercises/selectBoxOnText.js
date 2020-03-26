import React from 'react';
import { Button, message } from 'antd';
import firebase from '../../firebase';

import TextArea from '../../component/TextArea/TextArea';
import InputOption from '../../component/InputOption/InputOption';


export default class selectBoxOnText extends React.Component {
    _optionsArray = []; 
    exID = 0;
    user = '';

    constructor(props) {
        super(props);

        this.state = {
            textArea: '',
            saveFlag: false, // Boolean that indicates Text Area field saved
            emptyFields: false, // Boolean that indicates there are missing fields
            savedText: false,
            savedOptions: false, // Boolean that indicates options fields save status
            countSymbol: 0, // Number of & present in Text Area
            optionsArray: [], // Collections of options based on countSymbol
            exTitle: '', // Exercise Title
            edited: false, // Boolean that indicates that text Area has been edited
            exID: 0 // Default exercise ID
        }

        this.setRadio = this.setRadio.bind(this);
        this.setInput = this.setInput.bind(this);
    }

    componentDidMount = () => {
        this.exID = this.props.match.params.id; // Get Exercise ID from URL params
        this.user = this.props.user; // Get current user from component props
        if(!this.props.newEx) { // Check if it's a new exercise or not
            let data = firebase.database().ref('selectBoxOnText/' + this.user + '/ex' + this.exID); // Get title e text area from existing exercise
            data
                .once('value')
                .then(async (snapshot) => {
                    let allData = await snapshot.val();
                    this.setState({
                        exTitle: allData.exTitle,
                        textArea: allData.textArea,
                    });
                });
        }
    }

    // Set Text Area field
    setTextArea = (text) => {
        // Check stateFlag status and re-initialized options array to empty
        if(this.state.saveFlag) {
            this.setState({savedText: false, saveFlag: false, optionsArray: []});
            this._optionsArray = [];
        }

        this.setState({
            textArea: text,
            edited: true,
        }, this.setSymbolsCount); // Check new symbols count
    }

    setSymbolsCount = () => {
        this.setState({
            countSymbol: (this.state.textArea.match(/&/g) || []).length, // Regex check for & occurencies
        });
    }

    // Invoke when user click on save button for TextArea
    updateText = () => {
        if(this.state.exTitle && this.state.textArea && this.state.edited && this.state.countSymbol) {          
            try {
                // set author/title/text 
                firebase.database()
                    .ref("selectBoxOnText/" + this.user + "/ex" + this.exID)
                    .set(this.user)
                firebase.database()
                    .ref("selectBoxOnText/" + this.user + "/ex" + this.exID + "/textArea")
                    .set(this.state.textArea)
                firebase.database()
                    .ref("selectBoxOnText/" + this.user + "/ex" + this.exID + "/exTitle")
                    .set(this.state.exTitle)
                console.log("DATA SAVED");  

                // initialize options array with default values
                for (let i=0; i<this.state.countSymbol; i++) {  
                    this._optionsArray.push({
                        rightAnswer: 1,
                        opt1: '',
                        opt2: '',
                        opt3: '',
                    });
                }

                // change state of array options
                this.setState({
                    optionsArray: this._optionsArray,
                    emptyFields: false,
                    savedText: true
                }, () => {
                    if(this.props.newEx) { // Check if it's a new exercise and initialized options array in database
                        firebase.database()
                            .ref("selectBoxOnText/" + this.user + "/ex" + this.exID + "/options")
                            .set(this.state.optionsArray);
                        console.log("DATA SAVED");
                    }
                });

                // set boolean flag to true to show options
                this.setState({
                    saveFlag: true
                });
                message.success('Testo salvato correttamente!');
            } catch (err) {
                console.error(err);
                message.error('Errore durante il salvataggio!');
            }     
        } else {
            // Warning, required fields are missing
            this.setState({
                emptyFields: true
            });
            message.warning('Compila tutti i campi o assicurati di aver inserito le opzioni per poter andare avanti!');    
        }
    }

    // Set right answer => invoked by a change in radio button value
    setRadio = (e, index) => {
        if(this.state.savedOptions) this.setState({savedOptions: false});

        this._optionsArray[index].rightAnswer = e.target.value;
        this.setState({
            optionsArray: this._optionsArray
        });
    }

    // Set options label
    setInput = (e, index, elem) => {
        if(this.state.savedOptions) this.setState({savedOptions: false});
        switch(elem) {
            case 1: this._optionsArray[index].opt1 = e.target.value;break;
            case 2: this._optionsArray[index].opt2 = e.target.value;break;
            case 3: this._optionsArray[index].opt3 = e.target.value;break;
            default: console.log('Unexpected elem number');break;
        }
        this.setState({
            optionsArray: this._optionsArray
        }, console.log(this.state.optionsArray));
    }

    // Set Exercise Title
    setExTitle = (e) => {
        this.setState({exTitle: e.target.value});
    }

    // Invoked when user click on Save Button under options field
    updateOptions = () => {
        try {
            firebase.database()
                .ref("selectBoxOnText/" + this.user + "/ex" + this.exID + "/options")
                .set(this.state.optionsArray);
            console.log("DATA SAVED");

            this.setState({savedOptions: true});
            message.success('Opzioni salvate correttamente!');
        } catch (err) {
            console.error(err);
            message.error('Errore durante il salvataggio!');
        }      
    }

   
    render() {       
        return (
            <>  
                <div>   
                    <div>
                        <label htmlFor="title"><strong>Consegna</strong></label>
                        <input value={this.state.exTitle} id="title" onChange={this.setExTitle} style={{margin: 10, minWidth: 400}} />
                    </div>
                </div>
                <TextArea text={this.state.textArea} onChange={(text) => this.setTextArea(text)} />
                <div style={{position: 'relative'}}>
                    <Button onClick={this.updateText} type="primary">
                        Salva
                    </Button>
                </div>
                <hr style={{margin: 25}} />
                {
                    this.state.countSymbol ? (
                        <div>Simbolo presente</div>
                    ) : (
                        <div>Inserisci il simbolo <strong>&</strong> per aggiungere le opzioni</div>
                    )
                }              
                {   
                    this.state.saveFlag ? (
                        <>
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                {
                                    this.state.optionsArray.map((item, i) => 
                                        <InputOption key={i} i={i} opt={item} setInput={this.setInput} setRadio={this.setRadio} />
                                    )
                                }
                            </div>
                            <div>
                                <hr style={{margin: 25}} />
                                <div style={{position: 'relative', marginBottom: 50}}>
                                    <Button onClick={this.updateOptions} type="primary">
                                        Salva Opzioni
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : 
                    null
                }
    
            </>
        );
    }
   
}

