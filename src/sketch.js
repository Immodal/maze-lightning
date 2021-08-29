const MARGIN = 50
const CELL_SIZE = 10

let animation1 = null
let animation2 = null

function setup() {
    //frameRate(24)
    const canvas = createCanvas(1, 1)
    canvas.parent("#cv")

    windowResized()
}

function draw() {
    if (animation1.complete && animation2.complete) {
        init()
    }

    flasher.draw()
    // Search
    if (animation1.isSearching()) {
        //animation1.drawSearch()
        animation1.drawArcs()
    }

    if (animation2.isSearching()) {
        //animation2.drawSearch()
        animation2.drawArcs()
    }
    // Lightning
    if (!animation1.isSearching()) {
        animation1.drawLightning()
    }

    if (!animation2.isSearching()) {
        animation2.drawLightning()
    }
    
    animation1.step()
    if(frameCount %2==0)animation2.step()
}


function windowResized() {
    resizeCanvas(windowWidth - MARGIN, windowHeight - MARGIN)
    init()
}

function init() {
    const nCols = Math.floor(width/CELL_SIZE)
    const nRows = Math.floor(height/CELL_SIZE)
    
    flasher = new Flasher()
    animation1 = new Animation(nCols, nRows, 0, 0, width, height, flasher, SquareGrid, RandomPrims, BreadthFirstSearch)
    animation2 = new Animation(nCols, nRows, 0, 0, width, height, flasher, SquareGrid, RandomPrims, BreadthFirstSearch)
}
