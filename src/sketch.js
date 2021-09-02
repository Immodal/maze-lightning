const MARGIN = 50
const CELL_SIZE = 10
const SKELE_MIN_W = CELL_SIZE*10

let skeleDeadWait = 30
let skeleDeadFrameCount = 0

let lightning1 = null
let skele = null

function preload() {
    SKELEHIT.img = loadImage(SKELEHIT.src)
    SKELEIDLE.img = loadImage(SKELEIDLE.src)
    SKELEDEAD.img = loadImage(SKELEDEAD.src)
}

function setup() {
    //frameRate(24)
    const canvas = createCanvas(1, 1)
    canvas.parent("#cv")

    skele = new Skeleton(0, 0)

    windowResized()
}

function draw() {
    flasher.draw()
    // lightning1.drawDebug()
    if (lightning1.isStalled()) init()
    else if (!lightning1.grid.goalCell && lightning1.complete) init()
    else if (lightning1.grid.goalCell && skele.mode==Skeleton.MODES.DEAD && skele.cycles()>=1) {
        skeleDeadFrameCount += 1
        skele.draw(skele.sprites[Skeleton.MODES.DEAD].len-1)
        if (skeleDeadFrameCount>=skeleDeadWait) init()
    }
    else if (lightning1.complete && lightning1.grid.goalCell) {
        skele.setMode(Skeleton.MODES.DEAD)
        skele.draw()
        skele.animate()
    } else if (lightning1.isSearching()) {
        //lightning1.drawSearch(true, lightning1.searchMaxBrightness)
        lightning1.drawArcs()
        lightning1.drawMainPath(lightning1.pathBrightness)
        if (lightning1.grid.goalCell) {
            skele.setMode(Skeleton.MODES.IDLE)
            skele.draw()
            skele.animate()
        }
        lightning1.step()
    } else {
        lightning1.drawLightning()
        if (lightning1.grid.goalCell) {
            skele.setMode(Skeleton.MODES.HIT)
            skele.draw()
            skele.animate()
        }
        lightning1.step()
    }
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
    maze_gen = new RandomPrims(grid)
    maze_gen.run()
    solver = new Astar(grid, 1)
    lightning1 = new Lightning(0, 0, width, height, flasher, grid, solver)

    const skeleW = width*0.1
    skele.resize(skeleW<SKELE_MIN_W ? SKELE_MIN_W : skeleW)
    if (goalX && goalY) {
        skele.setMode(Skeleton.MODES.IDLE)
        skele.setPos(goalX, goalY)
    }

    skeleDeadFrameCount = 0
}

function mouseClicked() {
    init(mouseX, mouseY)
}

function resizeSprites(w) {
    const owMax = sprites.reduce((p, c) => p.ow > c.ow ? p : c).ow
    for (const s of sprites) {
        s.resize(w*s.ow/owMax, 0)
    }
}