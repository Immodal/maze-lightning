//TODO Resize using https://p5js.org/reference/#/p5/noSmooth
//https://anokolisa.itch.io/moon-graveyard
//https://jesse-m.itch.io/skeleton-pack

const MARGIN = 50
const SKELE_SIZE_RATIO = 0.1

const MAX_GRID_SIZE = 31
let gridSize = MAX_GRID_SIZE

const N_COLUMNS = 200
let cellSize = null

const SKELE_DEAD_WAIT = 50
let skeleDeadFrameCount = 0

const RANDOM_STRIKE_DELAY = 100
let randomStrikeDelayFrameCount = 0
let checkedStrike = false
let targetedStrike = false

let bg = null
let lightning1 = null
let skele = null

function preload() {
    BACKGROUND0.img = loadImage(BACKGROUND0.src)
    BACKGROUND1.img = loadImage(BACKGROUND1.src)
    SKELEHIT.img = loadImage(SKELEHIT.src)
    SKELEIDLE.img = loadImage(SKELEIDLE.src)
    SKELEDEAD.img = loadImage(SKELEDEAD.src)
    SKELEWALK.img = loadImage(SKELEWALK.src)
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
    if (lightning1.isStalled() || lightning1.complete && skele.isPatrolling()) {
        randomInit()
    // Revive Skele
    } else if (skeleDeadFrameCount>=SKELE_DEAD_WAIT) {
        runWithBackground(skeleRevive)
    // Lightning has faded, Skele death animation
    } else if (lightning1.complete && !skele.isPatrolling()) {
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
    if (targetedStrike) bg.draw(null, skele.mode == Skeleton.MODES.HIT) 
    else bg.draw(0)

    fn()

    if (!targetedStrike) {
        bg.draw(1)
        skele.draw()
    }
}


function lightningSearching() {
    if (!targetedStrike && randomStrikeDelayFrameCount<RANDOM_STRIKE_DELAY) {
        randomStrikeDelayFrameCount += 1
    } else {
        //lightning1.drawDebug()
        //lightning1.drawSearch(true)
        lightning1.drawArcs()
        lightning1.drawMainPath(1)
        lightning1.step()
        lightning1.step()
    }

    if (skele.isPatrolling() && !skele.hasMoveTarget() && Math.random() < 0.01) {
        const xMax = Math.floor(width-gridSize*cellSize/2)
        const xMin = Math.floor(gridSize*cellSize/2)
        skele.moveTo(utils.randInt(xMax, xMin), height-skele.getHeight())
    }
    skele.draw()
    skele.animate()
}


function lightningStrike() {
    lightning1.drawLightning()
    flasher.draw()
    if (targetedStrike && !checkedStrike && lightning1.solver.path.length) {
        for (const cell of lightning1.solver.path) {
            const cellX = cell.x*cellSize + lightning1.gx
            const cellY = cell.y*cellSize + lightning1.gy
            if (skele.contains(cellX, cellY)) {
                skele.setMode(Skeleton.MODES.HIT)
                break
            }
        }
        checkedStrike = true
    }
    skele.draw()
    skele.animate()
    lightning1.step()
}


function skeleDead() {
    skele.setMode(Skeleton.MODES.DEAD)
    skele.draw()
    if (skele.cycles()<1) {
        skele.animate()
        if (skele.cycles()>=1) {
            const sprite = skele.getSprite(Skeleton.MODES.DEAD)
            sprite.index = sprite.length()-1
        }
    }
    // Skele is dead, wait for set number of frames
    else skeleDeadFrameCount += 1
}


function skeleRevive() {
    skele.setMode(Skeleton.MODES.REVIVE)
    skele.draw()
    skele.animate()
    if (skele.cycles()>=1) randomInit()
}


function windowResized() {
    cellSize = Math.floor((windowWidth - MARGIN)/N_COLUMNS)
    // Round to nearest number wholly divisible by cell size
    // to prevent gaps in lightning
    const roundToCell = (x) => Math.ceil(x / cellSize) * cellSize - MARGIN
    const w = roundToCell(windowWidth)
    bg.resize(w)
    const h = roundToCell(bg.layers[0].height)
    const hMax = roundToCell(windowHeight)
    resizeCanvas(w, h > hMax ? hMax : h)

    gridSize = gridSize*cellSize > width ? Math.floor(width/cellSize) : MAX_GRID_SIZE
    skele.resize(width*SKELE_SIZE_RATIO)

    const xMax = Math.floor(width-gridSize*cellSize/2)
    const xMin = Math.floor(gridSize*cellSize/2)
    skele.setPos(utils.randInt(xMax, xMin), height-skele.getHeight())
    skele.setMode(Skeleton.MODES.IDLE)
    skele.moveTargetX = null
    skele.moveTargetY = null
    
    randomInit()
}

function randomInit() {
    const xMax = Math.floor(width-gridSize*cellSize/2)
    const xMin = Math.floor(gridSize*cellSize/2)
    init(utils.randInt(xMax, xMin))
}

function init(goalX, isTargeted=false) {
    targetedStrike = isTargeted
    randomStrikeDelayFrameCount = 0
    const nCols = gridSize*cellSize > width ? Math.floor(width/cellSize) : gridSize
    const nRows = Math.ceil(height/cellSize)

    const gCol = Math.floor(nCols/2)
    const gRow = nRows - 1 // Tie goal to bottom

    flasher = new Flasher()
    grid = new SquareGrid(nCols, nRows, gCol, gRow, 2)
    maze_gen = new RandomPrims(grid)
    maze_gen.run()
    solver = new BreadthFirstSearch(grid)

    lightning1 = new Lightning(goalX, 0, cellSize, flasher, grid, solver)
    checkedStrike = false

    if (!skele.isPatrolling()) skele.setMode(Skeleton.MODES.IDLE)
    skeleDeadFrameCount = 0
}

function mouseClicked() {
    if (mouseX>0 && mouseX<width && mouseY>0 && mouseY<height && skele.isPatrolling()) {
        init(mouseX, true)
    }
}
