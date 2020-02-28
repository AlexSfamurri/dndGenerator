import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import axios from 'axios';
import Character from './components/character'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Loot from './components/loot';
import NPC from './components/npc';
import Villian from './components/villian';
import Dungeon from './components/dungeon';
import Map from './components/map';
import MapDescription from './components/mapDescription';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            subRace:'',
            adventureClass:'',
            background:'',
            baseRace:'',
            stats:{},
            originalStats:{},
            eberron:false,
            ravnica:false,
            classicRolls:false,
            ravnicaRaces:false,
            eberronRaces:false,
            usePointBuy:false,
            loot:{},
            cr:0,
            lootType:'hoard',
            npc:{
                appearance:"",
                highAbility:"",
                lowAbility:"",
                talent:"",
                mannerism:"",
                interaction:"",
                ideals:"",
                bonds:"",
                flawAndOrSecret:""
            },
            villian:{
                objective:"",
                method:"",
                weakness:""
            },
            dungeon:{
                location:"",
                creator:"",
                purpose:"",
                history:""
            },
            map:[],
            pieces:{
                numChambers:0,
                numDoors:0,
                numPassages:0
            },
            description:{
                chambers:[],
                currentChamberState:[],
                contents:[]
            }
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleEberronChange = this.handleEberronChange.bind(this);
        this.handleRavnicaChange = this.handleRavnicaChange.bind(this);
        this.handleClassicRollsChange = this.handleClassicRollsChange.bind(this);
        this.handleRavnicaRacesChange = this.handleRavnicaRacesChange.bind(this);
        this.handleEberronRacesChange = this.handleEberronRacesChange.bind(this);
        this.handlePointBuyChange = this.handlePointBuyChange.bind(this);
        this.handleLootClick = this.handleLootClick.bind(this);
        this.handleLootTypeInput = this.handleLootTypeInput.bind(this);
        this.handleCRSelection = this.handleCRSelection.bind(this);
        this.handleNPCClick = this.handleNPCClick.bind(this);
        this.handleVillianClick = this.handleVillianClick.bind(this);
        this.handleDungeonClick = this.handleDungeonClick.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleDescriptionClick = this.handleDescriptionClick.bind(this);
    }
    handleMapClick(){
        axios.get(`https://dndcharactergenerator.herokuapp.com/map`)
            .then(({data})=>{
                this.setState({
                    map:data.map,
                    pieces:data.pieces
                })
            }).catch(e=>{
                console.error(e);
            })
    }
    handleDungeonClick(){
        axios.get('https://dndcharactergenerator.herokuapp.com/dungeon')
            .then(({data})=>{
                this.setState({
                    dungeon: data
                })
            }).catch(e=>{
                console.error(e);
            })
    }
    handleVillianClick(){
        axios.get('https://dndcharactergenerator.herokuapp.com/villian')
            .then(({data})=>{
                this.setState({
                    villian: data
                })
            }).catch(e=>{
                console.error(e);
            })
    }
    handleNPCClick(){
        axios.get('https://dndcharactergenerator.herokuapp.com/npc')
            .then(({data}) =>{
                this.setState({
                    npc: data
                })
            }).catch(e=>{
                console.error(e);
            })
    }
    handleDescriptionClick(){
        axios.get('https://dndcharactergenerator.herokuapp.com/description', {
            params:{
                numChambers:this.state.pieces.numChambers,
                purpose:this.state.dungeon.purpose
            }
        }).then(({data})=>{
            this.setState({
                description: data
            })
        }).catch(e=>{
            console.error(e);
        })
    }
    handleLootClick(){
        axios.get('https://dndcharactergenerator.herokuapp.com/loot', {
            params:{
                CR: this.state.cr,
                lootType: this.state.lootType
            }
        }).then(({data})=>{
            this.setState({
                loot: data
            })
        }).catch((e)=>{
            console.error(e);
        })
    }
    handleClick(){
        console.log(this.state.ravnicaRaces)
        //https://dndcharactergenerator.herokuapp.com
        
        axios.get('https://dndcharactergenerator.herokuapp.com/character', {
            params:{
                eberronInclude: this.state.eberron,
                ravnicaInclude: this.state.ravnica,
                classicRolls: this.state.classicRolls,
                includeEberronRaces: this.state.eberronRaces,
                includeRavnicaRaces: this.state.ravnicaRaces,
                usePointBuy: this.state.usePointBuy
            }
        })
            .then(({data})=>{
                this.setState({
                    subRace: data.subRace,
                    adventureClass: data.baseClass,
                    background: data.background,
                    baseRace: data.baseRace,
                    stats: data.stats,
                    originalStats: data.originalStats,
                })
            }).then(()=>{
                const temp={};
                for(let key in this.state){
                    if(typeof this.state[key] === "string"){
                        temp[key] = this.state[key].toUpperCase();
                    }
                }
                this.setState({
                    subRace: temp.subRace,
                    adventureClass: temp.adventureClass,
                    background: temp.background,
                    baseRace: temp.baseRace
                })
                
            })
            .catch(e=>{
                console.error(e);
                console.log('axios failed')
            })
    }

    handleLootTypeInput(e){
        console.log(e, 'this fired! handleLootTypeInput')
        this.setState({
            lootType: e
        })
    }
    handleCRSelection(e){
        console.log(e, 'this fired! this fired!');
        this.setState({
            cr: e
        })
    }
    handleEberronChange(){
        console.log('handles eberron')
        this.setState(state =>({
            eberron: !state.eberron,
            ravnica: false
        }))
    }
    handleRavnicaChange(){
        console.log('handles ravnica')
        this.setState(state =>({
            ravnica: !state.ravnica,
            eberron: false
        }))
    }
    handleClassicRollsChange(){
        this.setState(state =>({
            classicRolls: !state.classicRolls,
            usePointBuy: false
        }))
    }
    handleRavnicaRacesChange(){
        this.setState(state=>({
            ravnicaRaces: !state.ravnicaRaces
        }))
    }
    handleEberronRacesChange(){
        this.setState(state =>({
            eberronRaces: !state.eberronRaces
        }))
    }
    handlePointBuyChange(){
        this.setState(state=>({
            usePointBuy: !state.usePointBuy,
            classicRolls:false
        }))
    }
        

    render(){
        return(
            
            <div>
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                    crossorigin="anonymous"
                />
                <Accordion defaultActiveKey="0">
                    <Card>
                        
                        <Accordion.Toggle as={Card.Header}  eventKey="0">Character Creator!</Accordion.Toggle>
                        
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Character 
                                    characterGen={this.state} 
                                    eberronRacesFunc={this.handleEberronRacesChange} 
                                    ravnicaRacesFunc={this.handleRavnicaRacesChange} 
                                    ravnicaOnChange={this.handleRavnicaChange} 
                                    eberron={this.handleEberronChange} 
                                    classicRolls={this.handleClassicRollsChange}
                                    onChangeForPointBuyHanlder={this.handlePointBuyChange}
                                />
                                <Button variant="primary" size="lg" onClick={this.handleClick} block="true">Click for Fodder</Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        
                        <Accordion.Toggle as={Card.Header}  eventKey="1">Loot Generator!</Accordion.Toggle>
                        
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <Loot lootObj={this.state.loot} handleLootTypeInput={this.handleLootTypeInput} handleCRSelection={this.handleCRSelection}/>
                                <Button variant="primary" size="lg" onClick={this.handleLootClick} block="true">Click for Shinies</Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        
                        <Accordion.Toggle as={Card.Header} eventKey="2">NPC Details Generator</Accordion.Toggle>
                        
                        <Accordion.Collapse eventKey="2">
                            <Card.Body>
                                <NPC npc={this.state.npc}/>
                                <Button variant="primary" size="lg" onClick={this.handleNPCClick} block="true">Click for "Intresting" NPC</Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        
                        <Accordion.Toggle as={Card.Header} eventKey="3">Villian Generator</Accordion.Toggle>
                        
                        <Accordion.Collapse eventKey="3">
                            <Card.Body>
                                <Villian villian={this.state.villian} />
                                <Button variant="primary" size="lg" onClick={this.handleVillianClick} block="true">Click for THE Bad Guy</Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        
                        <Accordion.Toggle as={Card.Header} eventKey="4">Dungeon Info Generator</Accordion.Toggle>
                        
                        <Accordion.Collapse eventKey="4">
                            <Card.Body>
                                <Dungeon dungeon={this.state.dungeon} />
                                <Button variant="primary" onClick={this.handleDungeonClick} block="true">Click for Dungeon Ideas</Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="5">Map Maker</Accordion.Toggle>

                        <Accordion.Collapse eventKey="5">
                            <Card.Body>
                                <Map map={this.state.map} />
                                <Button variant="primary" onClick={this.handleMapClick} block="true">Click for Random Map</Button>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="6">Populate the dungeon!</Accordion.Toggle>

                        <Accordion.Collapse eventKey="6">
                            <Card.Body>
                                <div>
                                    <MapDescription description={this.state.description} />
                                    <Button variant="primary" onClick={this.handleDescriptionClick} block="true" />
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;