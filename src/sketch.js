const MARGIN = 50
const CELL_SIZE = 10

let animation1 = null

function setup() {
    //frameRate(24)
    const canvas = createCanvas(1, 1)
    canvas.parent("#cv")

    windowResized()
}

function draw() {
    if (animation1.complete) {
        init()
    }

    flasher.draw()
    if (animation1.isSearching()) {
        //animation1.drawSearch()
        animation1.drawArcs()
        animation1.drawMainPath(animation1.pathBrightness)
    } else {
        animation1.drawLightning()
    }
    
    animation1.step()
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
}
