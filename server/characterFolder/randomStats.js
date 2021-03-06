const stats = require('./generator');
const baseClass = require('./classGenerator');
const background = require('./backgroundGen');
const race = require('./baseRace');
const subRace = require('./subRace');
const classicRoller = require('./classicGenerator')
const nonDragonmarkedRaces = require('./normalRacialStatAssignment');
const dragonmarkedRaces = require('./dragonmarkStatAssignment');
const pointBuyStats = require('./pointBuy');



const characterCreator = ({eberronInclude, ravnicaInclude, classicRolls, includeEberronRaces, includeRavnicaRaces, usePointBuy})=>{
    const characterObj = {};
    if(usePointBuy === 'true'){
        console.log('point buy!')
        characterObj.stats = pointBuyStats();
    }else if(classicRolls === 'false'){
        characterObj.stats = classicRoller()
    }else{
        characterObj.stats = stats();
    }
    characterObj.baseClass = baseClass();
    characterObj.background = background(ravnicaInclude, eberronInclude);
    characterObj.baseRace = race(eberronInclude, includeEberronRaces, includeRavnicaRaces);
    const subRaceObj = subRace(characterObj.baseRace, eberronInclude)
    for (let key in subRaceObj){
        if(key !== 'noSubrace'){
            characterObj.subRace = key;         
        }
    }
    characterObj.originalStats = {
        'str':characterObj.stats.str,
        'dex':characterObj.stats.dex,
        'con':characterObj.stats.con,
        'int':characterObj.stats.int,
        'wis':characterObj.stats.wis,
        'cha':characterObj.stats.cha
    }
    if(eberronInclude==='false'){
        characterObj.stats = nonDragonmarkedRaces(characterObj.baseRace, characterObj.stats);
        console.log('point buy! ', characterObj.stats)

        try{
            for (let key in subRaceObj){
                console.log(subRaceObj);
                if(key === 'mountain' || characterObj.baseRace === 'gith'){
                    characterObj.stats[subRaceObj[key]] += 2;
                }
                else if(characterObj.baseRace === 'shifter'){
                    console.log(key)
                    characterObj.stats[subRaceObj[key][0]] += 2;
                    characterObj.stats[subRaceObj[key][1]] += 1;
                }else if(key !== 'noSubrace'){
                    characterObj.stats[subRaceObj[key]] += 1;
                }
            }
        }catch{
            console.log('i guess there is something wrong here as well')
        }
    }else{
        console.log(characterObj)
        characterObj.stats = dragonmarkedRaces(characterObj.subRace, characterObj.stats);
    }
    
    
    
    return characterObj
}

module.exports = characterCreator;