
const MapGenVTwo = require('../server/mapGenFolder/dndMapMakerv2');
const MapCompiler = require('../server/mapGenFolder/mapCompiler');
const StartingRoom = require('../server/mapGenFolder/startingRoomV2');
const Door = require('../server/mapGenFolder/doorV2');
const dice = require('../server/dice');
const { test } = require('mocha');
const DoorVTwo = require('../server/mapGenFolder/doorV2');
const Cartographer = require('../server/mapGenFolder/cartographer')
var expect = require('chai').expect;

describe('mapGenV2', ()=>{
    beforeEach(()=>{
        mapGen = new MapGenVTwo(100,100);
    });

    it('should already populate a 2D array with tiles once it has been created, that is 1/5 the value that was entered in', ()=>{
        const testMap = mapGen.getMap();
        expect(testMap).to.be.an('array').to.have.lengthOf(100/5);
        expect(testMap[0]).to.be.an('array').to.have.lengthOf(100/5);
    });
    it('should be populated with tiles', ()=>{
        const testMap = mapGen.getMap();
        expect(testMap[0][0].getTileInfo().x).to.be.a('number')
        expect(testMap[10][0].getTileInfo().y).to.be.a('number');
        expect(testMap[0][10].getTileInfo().type).to.be.a('string')
        expect(testMap[5][5].getTileInfo().type).to.equal('available');
    });
    it('should be populated with tiles that know their neighbors', ()=>{
        const testMap = mapGen.getMap();
        expect(testMap[0][0].getNeighbors());
        expect(testMap[0][0].getNeighbors().n).to.equal(null);
        expect(testMap[19][19].getNeighbors().e).to.equal(null);
        // console.log(testMap[0][0].getNeighbors())
        expect(testMap[10][10].getNeighbors().e.y).to.equal(11)
    });
    
    it('should let tiles keep track of neighbor changes', ()=>{
        const testMap = mapGen.getMap();
        const testTile = testMap[5][5];
        const testNeighbor = testMap[5][6];
        const preChangeNeighborType = testNeighbor.type;
        expect(testTile.getNeighbors().e.type).to.equal(preChangeNeighborType);
        testNeighbor.updateType('changed');
        expect(testTile.getNeighbors().e.type).to.equal('changed');
    })
});

describe('mapCompiler',()=>{
    beforeEach(()=>{
        mapGen = new MapGenVTwo(100,100);
    });
    it('should use high order functions inorder to allow for reusable code on individual tiles', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const testTile = testMap[5][5];
        expect(testTile.getTileInfo().type).to.be.a('string');
        expect(testTile.getTileInfo().type).to.equal('available');
        mapCompiler.manipulateThisTile(5, 5, (tile)=>{
            tile.updateType('changeMade');
        })
        expect(testTile.getTileInfo().type).to.equal('changeMade');

    });
    it('should handle an error if x and y are too large or too small for the table', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        expect(mapCompiler.manipulateThisTile(100,100, ()=>{
            console.log('does nothing');
        })).to.equal(null);
    });
    it('should be able to manipulate specific neighbors', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const testTileNorthNeighbor = testMap[5][5].getNeighbors().n;
        expect(testTileNorthNeighbor.getTileInfo().type).to.be.a('string');
        expect(testTileNorthNeighbor.getTileInfo().type).to.equal('available');
        mapCompiler.manipulateThisTileNeighbor(5,5,'n', (tileNeighbor)=>{
            tileNeighbor.updateType('changed');
        });
        expect(testTileNorthNeighbor.getTileInfo().type).to.equal('changed');
    });
    it('should be able to handle errors if a cardnial direction of n,e,s,w is not passed or used',()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const testTile = testMap[5][5];
        expect(mapCompiler.manipulateThisTileNeighbor(5,5,'t',(tile)=>{
            console.log('do nothing');
        })).to.equal(null);
    });

    it('should be able to be able to filter out tiles by type', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const testTile = testMap[5][5];
        testTile.updateType('changed');
        const result = mapCompiler.getAnchorPointsForBuild('changed')[0].getTileInfo().type;
        expect(testTile.getTileInfo().type).to.equal(result);
    });

    it('should be able to find edges that can be changed', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        testMap[5][5].updateType('edge');
        testMap[5][6].updateType('edge');
        testMap[5][7].updateType('edge');
        testMap[6][5].updateType('edge');
        testMap[6][6].updateType('edge');
        testMap[6][7].updateType('edge');
        testMap[7][5].updateType('edge');
        testMap[7][6].updateType('edge');
        testMap[7][7].updateType('edge');
        testMap[8][5].updateType('edge');
        testMap[8][6].updateType('edge');
        testMap[8][7].updateType('edge');
        const northResultShouldHaveLengthOfThree = mapCompiler.findEdgeTilesByType('n', 'edge');
        expect(northResultShouldHaveLengthOfThree.length).to.equal(3);
        const southResultShouldHaveLengthOfThree = mapCompiler.findEdgeTilesByType('s', 'edge');
        expect(southResultShouldHaveLengthOfThree.length).to.equal(3);
        const eastResultsShouldHaveLengthOfFour = mapCompiler.findEdgeTilesByType('e', 'edge');
        expect(eastResultsShouldHaveLengthOfFour.length).to.equal(4);
        const westResultsShouldHaveLengthOfFour = mapCompiler.findEdgeTilesByType('w', 'edge');
        expect(westResultsShouldHaveLengthOfFour.length).to.equal(4);
        
    })

})

describe('StartingRoomV2', ()=>{
    beforeEach(()=>{
        mapGen = new MapGenVTwo(100,100);
    });
    it('should work hand in hand with mapgen and mapcompiler to work only on what it needs to work on', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const startingRoom = new StartingRoom();
        const testTile = testMap[5][5];
        mapCompiler.manipulateThisTile(5,5,startingRoom.buildRoom);
        expect(testTile.getTileInfo().type).to.equal('starting room');
    });
    it('should build a room equal in width and length to its dimensions',()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const startingRoom = new StartingRoom();
        mapCompiler.traverseTilesInADirection(5, 5, 's', 'e', 2, 2, (tile)=>{
            startingRoom.buildRoom(tile);
        });

        expect(testMap[5][5].getTileInfo().type).to.equal('starting room');
        expect(testMap[6][5].getTileInfo().type).to.equal('starting room');
        expect(testMap[5][6].getTileInfo().type).to.equal('starting room');
        expect(testMap[6][6].getTileInfo().type).to.equal('starting room');
        expect(testMap[4][5].getTileInfo().type).to.equal('available');
    });
    it('should build a room using the room object\'s width and length',()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const startingRoom = new StartingRoom();
        mapCompiler.traverseTilesInADirection(5, 5, 's', 'e', startingRoom.getWidth(), startingRoom.getLength(), (tile)=>{
            startingRoom.buildRoom(tile);
        });
        expect(testMap[5][5].getTileInfo().type).to.equal('starting room');
        expect(testMap[5 + startingRoom.getWidth()-1][5].getTileInfo().type).to.equal('starting room');
        expect(testMap[5 + startingRoom.getWidth()-1][5 + startingRoom.getLength()-1].getTileInfo().type).to.equal('starting room');
        expect(testMap[5][5 + startingRoom.getLength()-1].getTileInfo().type).to.equal('starting room');
        expect(testMap[4][5].getTileInfo().type).to.equal('available');
    });
    
    it('should drop anchors using the mapcompiler methods',()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const startingRoom = new StartingRoom();
        mapCompiler.traverseTilesInADirection(5, 5, 's', 'e', startingRoom.getWidth(), startingRoom.getLength(), (tile)=>{
            startingRoom.buildRoom(tile);
        });
        const cardnialExits = startingRoom.getExitLocations();
        const exitTypes = startingRoom.getExitTypes();
        const mapCompilerSearchresults = [];
        for(let i = 0; i < cardnialExits.length; i++){
            mapCompilerSearchresults.push(mapCompiler.findEdgeTilesByType(cardnialExits[i], 'starting room'));
        }
        for(let i = 0; i < mapCompilerSearchresults.length; i++){
            const resultsLength = mapCompilerSearchresults[i].length;
            mapCompilerSearchresults[i][dice.roll(`1d${resultsLength}`).result - 1].updateType(exitTypes[i]);
        }
        const filtedResults = mapCompilerSearchresults.map(array=>{
            return array.filter(tile=>tile.getTileInfo().type !== 'available').pop();
        });
        expect(filtedResults.length).to.equal(exitTypes.length);
    });
})

describe('DoorVTwo', ()=>{
    beforeEach(()=>{
        mapGen = new MapGenVTwo(100,100);
    });

    it('should replace door anchors with the appropriate type of door', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const door = new DoorVTwo;
        const testTile = testMap[5][5];
        testTile.updateType('doorAnchor');
        mapCompiler.manipulateThisTile(5,5,door.tellTileWhatKindOfDoor);
        expect(testTile.getTileInfo().type).to.equal(door.getType());
    });
    it('should be able to tell which neighbor it came from and which neigbor it needs to drop a new anchor',()=>{
        const testMap = mapGen.getMap();
        const door = new DoorVTwo;
        const testTile = testMap[5][5];
        testTile.updateType('doorAnchor');
        testTile.getNeighbors().n.updateType('starting room');
        door.deployAnchor(testTile, 'starting room');
        expect(testTile.getNeighbors().s.getTileInfo().type).to.equal(door.getExit());
    });
    it('should work with startingRoomV2 to place doors when door anchors have been dropped',()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const door = new DoorVTwo;
        const startingRoom = new StartingRoom();
        mapCompiler.traverseTilesInADirection(5, 5, 's', 'e', startingRoom.getWidth(), startingRoom.getLength(), (tile)=>{
            startingRoom.buildRoom(tile);
        });
        const cardnialExits = startingRoom.getExitLocations();
        const exitTypes = startingRoom.getExitTypes();
        const mapCompilerSearchresults = [];
        for(let i = 0; i < cardnialExits.length; i++){
            mapCompilerSearchresults.push(mapCompiler.findEdgeTilesByType(cardnialExits[i], 'starting room'));
        }
        for(let i = 0; i < mapCompilerSearchresults.length; i++){
            const resultsLength = mapCompilerSearchresults[i].length;
            if(resultsLength > 1){
                mapCompilerSearchresults[i][dice.roll(`1d${resultsLength}`).result - 1].updateType(exitTypes[i]);
            } else{
                mapCompilerSearchresults[i][0].updateType(exitTypes[i]);
            }
        }
        const doorAnchors = mapCompiler.getAnchorPointsForBuild('door');
        for(let i = 0; i < doorAnchors.length; i ++){
            door.tellTileWhatKindOfDoor(doorAnchors[i]);
            door.deployAnchor(doorAnchors[i], 'starting room');
        }
        const numberOfDoorAnchorsRemaining = mapCompiler.getAnchorPointsForBuild('door').length;
        expect(numberOfDoorAnchorsRemaining).to.equal(0);
    });
})

describe('cartographer',()=>{
    beforeEach(()=>{
        mapGen = new MapGenVTwo(100,100);
    });

    it('should be able to tell us its current orientation', ()=>{
        const testMap = mapGen.getMap();
        const walker = new Cartographer(testMap[5][5]);

        expect(walker.getOrientation().opposite).to.equal('n');
        expect(walker.getOrientation().same).to.equal('s');
        expect(walker.getOrientation().left).to.equal('w');
        expect(walker.getOrientation().right).to.equal('e');
    });

    it('should be able to tell us its current orientation when its facing direction changes', ()=>{
        const testMap = mapGen.getMap()
        const walker = new Cartographer(testMap[5][5]);
        walker.startWalking('s');
        expect(walker.getOrientation().opposite).to.equal('s');
        expect(walker.getOrientation().same).to.equal('n');
        expect(walker.getOrientation().left).to.equal('e');
        expect(walker.getOrientation().right).to.equal('w');
    })
    it('should be able to let us know what tile is infront of Walker the cartographer', ()=>{
        const testMap = mapGen.getMap();
        const mapCompiler = new MapCompiler(testMap);
        const door = new DoorVTwo;
        const startingRoom = new StartingRoom();
        const walker = new Cartographer(testMap[5][5]);
        mapCompiler.traverseTilesInADirection(5, 5, 's', 'e', startingRoom.getWidth(), startingRoom.getLength(), (tile)=>{
            startingRoom.buildRoom(tile);
        });
        const cardnialExits = startingRoom.getExitLocations();
        const exitTypes = startingRoom.getExitTypes();
        const mapCompilerSearchresults = [];
        for(let i = 0; i < cardnialExits.length; i++){
            mapCompilerSearchresults.push(mapCompiler.findEdgeTilesByType(cardnialExits[i], 'starting room'));
        };
        for(let i = 0; i < mapCompilerSearchresults.length; i++){
            const resultsLength = mapCompilerSearchresults[i].length;
            if(resultsLength > 1){
                mapCompilerSearchresults[i][dice.roll(`1d${resultsLength}`).result - 1].updateType(exitTypes[i]);
            } else{
                mapCompilerSearchresults[i][0].updateType(exitTypes[i]);
            }
        };
        const doorAnchors = mapCompiler.getAnchorPointsForBuild('door');
        for(let i = 0; i < doorAnchors.length; i ++){
            door.tellTileWhatKindOfDoor(doorAnchors[i]);
            door.deployAnchor(doorAnchors[i], 'starting room');
        };

        walker.startWalking('n');
        expect(walker.getFrontFacingTile().getTileInfo().type).to.equal(testMap[5][5].getNeighbors().n.getTileInfo().type);
        expect(walker.getFrontFacingTile().getTileInfo().type).to.not.equal(testMap[5][5].getTileInfo().type);
    })
})