//TODO Resize using https://p5js.org/reference/#/p5/noSmooth

const MARGIN = 50
const CELL_SIZE = 10
const SKELE_SIZE_RATIO = 0.1

let skeleDeadWait = 30
let skeleDeadFrameCount = 0

let bg = null
let lightning1 = null
let skele = null

function preload() {
    BACKGROUND0.img = loadImage(BACKGROUND0.src)
    BACKGROUND1.img = loadImage(BACKGROUND1.src)
    SKELEHIT.img = loadImage(SKELEHIT.src)
    SKELEIDLE.img = loadImage(SKELEIDLE.src)
    SKELEDEAD.img = loadImage(SKELEDEAD.src)
}

function setup() {
    const canvas = createCanvas(1, 1)
    canvas.parent("#cv")

    skele = new Skeleton(0, 0)
    bg = new Background()

    windowResized()
}

function draw() {
    // Stalled or no goal completion
    if (lightning1.isStalled() || 
        !lightning1.grid.goalCell && lightning1.complete) {
        init()
    // Skele is dead, wait for set number of frames
    } else if (lightning1.grid.goalCell && skele.mode==Skeleton.MODES.DEAD && skele.cycles()>=1) {
        runWithBackground(skeleDeadHoldTime)
    }
    // Skele death animation
    else if (lightning1.complete && lightning1.grid.goalCell) {
        runWithBackground(skeleDead)
    // Lightning search
    } else if (lightning1.isSearching()) {
        runWithBackground(lightningSearching)
    // Lightning strike
    } else {
        runWithBackground(lightningStrike)
    }
}


function runWithBackground(fn) {
    if (lightning1.grid.goalCell) bg.draw(null, skele.mode == Skeleton.MODES.HIT) 
    else bg.draw(0)

    fn()

    if (!lightning1.grid.goalCell) {
        bg.draw(1)
    }
}


function lightningSearching() {
    //lightning1.drawSearch()
    lightning1.drawArcs()
    lightning1.drawMainPath(1)
    if (lightning1.grid.goalCell) {
        skele.setMode(Skeleton.MODES.IDLE)
        skele.draw()
        skele.animate()
    }
    lightning1.step()
}


function lightningStrike() {
    lightning1.drawLightning()
    flasher.draw()
    if (lightning1.grid.goalCell) {
        skele.setMode(Skeleton.MODES.HIT)
        skele.draw()
        skele.animate()
    }
    lightning1.step()
}


function skeleDead() {
    skele.setMode(Skeleton.MODES.DEAD)
    skele.draw()
    skele.animate()
}


function skeleDeadHoldTime() {
    skeleDeadFrameCount += 1
    skele.draw(skele.sprites[Skeleton.MODES.DEAD].len-1)
    if (skeleDeadFrameCount>=skeleDeadWait) init()
}


function windowResized() {
    // Round to nearest number wholly divisible by cell size
    // to prevent gaps in lightning
    const roundToCell = (x) => Math.ceil(x / CELL_SIZE) * CELL_SIZE - MARGIN
    const w = roundToCell(windowWidth)
    bg.resize(w)
    const h = roundToCell(bg.layers[0].height)
    const hMax = roundToCell(windowHeight)
    resizeCanvas(w, h > hMax ? hMax : h)

    skele.resize(width*SKELE_SIZE_RATIO)

    init()
}

function init(goalX=-1, goalY=-1) {
    const nCols = Math.floor(width/CELL_SIZE)
    const nRows = Math.floor(height/CELL_SIZE)
    const gCol = Math.floor(goalX/CELL_SIZE)
    // Tie goal to bottom
    const gRow = Math.floor(height/CELL_SIZE) - 1

    flasher = new Flasher()
    grid = new SquareGrid(nCols, nRows, gCol, gRow)
    maze_gen = new RandomPrims(grid)
    maze_gen.run()
    solver = new Astar(grid, 1)
    lightning1 = new Lightning(0, 0, width, height, flasher, grid, solver)

    if (goalX && goalY) {
        skele.setMode(Skeleton.MODES.IDLE)
        skele.setPos(goalX, height-skele.getHeight())
    }
    skeleDeadFrameCount = 0
}

function mouseClicked() {
    if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height) init(mouseX, mouseY)
}
