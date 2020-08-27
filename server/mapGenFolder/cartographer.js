class Cartographer{
    constructor(locationTile){
        this.location = locationTile;
        this.facingDirection = '';
        this.frontFacingTile = locationTile.getNeighbors().n;
        this.orientation = {
            opposite:'n',
            right:'e',
            same:'s',
            left:'w'
        };

        this.getOrientation = this.getOrientation.bind(this);
        this.getFacingDirection = this.getFacingDirection.bind(this);
        this.getFrontFacingTile = this.getFrontFacingTile.bind(this);
        this.startWalking = this.startWalking.bind(this);
        this.turnAround = this.turnAround.bind(this);
    }
    getOrientation(){
        return this.orientation;
    }
    getFacingDirection(){
        return this.facingDirection;
    }
    getFrontFacingTile(){
        return this.frontFacingTile;
    }
    startWalking(direction){
        this.facingDirection = direction;
        this.frontFacingTile = this.location.getNeighbors()[direction];
        this.turnAround();
    }
    turnAround(){
        if(this.facingDirection === 'n'){
            this.orientation = {
                opposite:'n',
                right:'e',
                same:'s',
                left:'w'
            };
        }else if(this.facingDirection === 'e'){
            this.orientation = {
                opposite:'e',
                right:'s',
                same:'w',
                left:'n'
            }
        }else if(this.facingDirection === 's'){
            this.orientation = {
                opposite:'s',
                right:'w',
                same:'n',
                left:'e'
            }
        }else if(this.facingDirection === 'w'){
            this.orientation = {
                opposite:'w',
                right:'n',
                same:'e',
                left:'s'
            }
        }
    }
    
}

module.exports = Cartographer;