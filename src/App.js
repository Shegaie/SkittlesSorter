import './App.css';
import React, {useEffect, useState} from "react";
import {PieChart} from 'react-minimal-pie-chart';
import axios from 'axios';

function App() {
    const [arduinoIP, setArduinoIP] = useState("");
    const [red, setRed] = useState(0);
    const [orange, setOrange] = useState(0);
    const [yellow, setYellow] = useState(0);
    const [green, setGreen] = useState(0);
    const [purple, setPurple] = useState(0);
    const colorField = [
        {key: 1, color: "red", value: setRed},
        {key: 2, color: "orange", value: setOrange},
        {key: 3, color: "yellow", value: setYellow},
        {key: 4, color: "green", value: setGreen},
        {key: 5, color: "purple", value: setPurple},
    ]

    useEffect(() => {
        setInterval(() => {
            colorField.forEach((obj) => {
                axios
                    .get(`https://api.thingspeak.com/channels/1569047/fields/${obj.key}.json?api_key=3V0AUAEY8YK2CG86`)
                    .then(res => {
                        const data = res.data?.feeds;
                        let totalNb = 0;
                        data.forEach((feed) => {
                            if (feed["field" + obj.key])
                                totalNb += parseInt(feed["field" + obj.key]);
                        })
                        obj.value(totalNb);
                    })
            })
        }, 2000);
    }, [])

    return (
        <div style={{
            marginTop: '200px',
            "width": "100vw",
            "display": "flex",
            "flexDirection": "column",
            "alignItems": "center"
        }}>
            <h1>
                Le trieur de
                <span style={{marginLeft: '10px', "color": "#e64808"}}>S</span>
                <span style={{"color": "#f1be02"}}>K</span>
                <span style={{"color": "#048207"}}>I</span>
                <span style={{"color": "#441349"}}>T</span>
                <span style={{"color": "#c0043f"}}>T</span>
                <span style={{"color": "#e64808"}}>L</span>
                <span style={{"color": "#f1be02"}}>E</span>
                <span style={{"color": "#048207"}}>S</span>
            </h1>
            <div style={{marginTop: '50px'}}>
                <label>Arduino IP</label>
                <input style={{marginLeft: '10px'}} value={arduinoIP}
                       onChange={(event => setArduinoIP(event.target.value))} name="ip" id="ip"/>
            </div>
            <div style={{marginTop: '50px'}}>
                <button
                    style={{
                        marginRight: "20px",
                        backgroundColor: "#3ea6ff",
                        color: "white",
                        padding: "4px 12px 4px 12px",
                        borderRadius: "30px"
                    }}
                    onClick={() => {
                        if (arduinoIP.length === 0) {
                            alert("Vous devez rentrer l'ip de votre serveur arduino !");
                            return;
                        }
                        axios.get("http://" + arduinoIP + "/start").then(() => {
                            alert("La machine est lancée");
                        }).catch(() => {
                            alert("Une erreur c'est produite");
                        });
                    }}
                >
                    Commencer
                </button>
                <button
                    style={{
                        marginLeft: "20px",
                        backgroundColor: "#ff3e3e",
                        color: "white",
                        padding: "4px 12px 4px 12px",
                        borderRadius: "30px"
                    }}
                    onClick={() => {
                        if (arduinoIP.length === 0) {
                            alert("Vous devez rentrer l'ip de votre serveur arduino !");
                            return;
                        }
                        axios.get("http://" + arduinoIP + "/stop").then(() => {
                            alert("La machine est stopée");
                        }).catch(() => {
                            alert("Une erreur c'est produite");
                        });
                    }}
                >
                    Arrêter
                </button>
            </div>
            <div style={{display: "flex", width: '700px', justifyContent: 'space-around', marginTop: '30px'}}>
                <div
                    style={{
                        "height": "200px",
                        "width": "200px",
                        "padding": "20px 50px",
                        "display": "flex",
                        "flexDirection": "column",
                        "justifyContent": "space-evenly",
                        "backgroundColor": "white",
                        "boxShadow": "0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)"
                    }}>
                    <span style={{"color": "#e60808", "fontSize": "20px"}}>rouge: {red}</span>
                    <span style={{"color": "#e64808", "fontSize": "20px"}}>orange: {orange}</span>
                    <span style={{"color": "#048207", "fontSize": "20px"}}>vert: {green}</span>
                    <span style={{"color": "#f1be02", "fontSize": "20px"}}>jaune: {yellow}</span>
                    <span style={{"color": "#441349", "fontSize": "20px"}}>violet: {purple}</span>
                </div>
                <div style={{width:"300px", height: '250px'}}>
                    <PieChart
                        data={[
                            {title: 'Rouge', value: red, color: '#e60808'},
                            {title: 'Orange', value: orange, color: '#e64808'},
                            {title: 'Vert', value: green, color: '#048207'},
                            {title: 'Jaune', value: yellow, color: '#f1be02'},
                            {title: 'Violet', value: purple, color: '#441349'},
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
