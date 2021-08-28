const MARGIN = 50
const CELL_SIZE = 10

let sqrGrid = null
let rPrims = null
let bfs = null

function setup() {
    //frameRate(24)
    const canvas = createCanvas(1, 1)
    canvas.parent("#cv")

    windowResized()
}

function windowResized() {
    resizeCanvas(windowWidth - MARGIN, windowHeight - MARGIN)
    init()
}

function init() {
    const nCols = Math.floor(width/CELL_SIZE)
    const nRows = Math.floor(height/CELL_SIZE)
    
    sqrGrid = new SquareGrid(nCols, nRows, 0, 0, width, height)
    const start = sqrGrid.cells.get(utils.randInt(nCols),0)
    rPrims = new RandomPrims(sqrGrid, start)
    while (rPrims.stack.length) {
        rPrims.step()
    }
    bfs = new BreadthFirstSearch(sqrGrid, start)
}

function draw() {
    if (sqrGrid.animationComplete) {
        init()
    }
    sqrGrid.draw(bfs)
    // rPrims.step()
    bfs.step()
}
