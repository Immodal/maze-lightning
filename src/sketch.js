const CANVAS_W = 400
const CANVAS_H = 700

let sqrGrid = null
let rPrims = null
let bfs = null

function setup() {
    //frameRate(5)
    const canvas = createCanvas(CANVAS_W, CANVAS_H)
    canvas.parent("#cv")

    sqrGrid = new SquareGrid(20, 35, 0, 0, CANVAS_W, CANVAS_H)
    rPrims = new RandomPrims(sqrGrid, sqrGrid.cells.get(1,0))
    while (rPrims.stack.length) {
        rPrims.step()
    }
    bfs = new BreadthFirstSearch(sqrGrid, sqrGrid.cells.get(1,0))
}

function draw() {
    background("#0000ff")
    sqrGrid.draw(bfs.path)
    // rPrims.step()
    bfs.step()
}
