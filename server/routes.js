const app = require('./index.js');
const characterObj = require('./randomStats');
const path = require('path');
const express = require('express');
const loot = require('./lootBranch');
const npc = require('./npcGenerator');
const villian = require('./villian');
const dungeon = require('./dungeonBuilder');
const Map = require('./dndMapMaker');
const cors = require('cors');
app.use(cors())
app.use(express.static(path.join(__dirname, '../dist')))

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
})

app.get('/character', (req, res)=>{
    console.log(req.query);
    res.send(characterObj(req.query))
})

app.get('/loot', (req, res)=>{
    res.send(loot(req.query));
})

app.get('/npc', (req, res)=>{
    res.send(npc());
})

app.get('/villian', (req, res)=>{
    res.send(villian());
})

app.get('/dungeon', (req, res)=>{
    const mapObj = new Map(100,100);
    mapObj.setStartingArea();
    mapObj.setStartingArea();
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    const map = mapObj.getMap();
    const dungeonObj = dungeon();
    dungeonObj.map = map
    res.send(dungeonObj);
})

app.get(`/map`, (req, res)=>{
    const mapObj = new Map(100,100);
    mapObj.setStartingArea();
    mapObj.setStartingArea();
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    mapObj.upDateMap(mapObj.getMap());
    const map = mapObj.getMap();
    res.send(map)
})