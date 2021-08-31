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
    // animation1.drawDebug()
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

function init(goalX=-1, goalY=-1) {
    const nCols = Math.floor(width/CELL_SIZE)
    const nRows = Math.floor(height/CELL_SIZE)
    const gCol = Math.floor(goalX/CELL_SIZE)
    const gRow = Math.floor(goalY/CELL_SIZE)
    
    flasher = new Flasher()
    grid = new SquareGrid(nCols, nRows, gCol, gRow)
    animation1 = new Animation(0, 0, width, height, flasher, grid, RandomPrims, BreadthFirstSearch)
}

function mouseClicked() {
    init(mouseX, mouseY)
}