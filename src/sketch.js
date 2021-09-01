const MARGIN = 50
const CELL_SIZE = 10

let animation1 = null
let skeleHit = null
let skeleIdle = null
let skeleDead = null
let sprites = null

function preload() {
    SKELEHIT.img = loadImage(SKELEHIT.src)
    SKELEIDLE.img = loadImage(SKELEIDLE.src)
    SKELEDEAD.img = loadImage(SKELEDEAD.src)
}

function setup() {
    //frameRate(24)
    const canvas = createCanvas(1, 1)
    canvas.parent("#cv")

    skeleHit = new Sprite(SKELEHIT.img, SKELEHIT.frames, 0, 0)
    skeleIdle = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0, 0)
    skeleDead = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 0, 0)
    sprites = [skeleIdle, skeleHit, skeleDead]

    windowResized()
}

function draw() {
    flasher.draw()
    // animation1.drawDebug()
    if (animation1.complete) {
        init()
    } else if (animation1.isSearching()) {
        //animation1.drawSearch()
        animation1.drawArcs()
        animation1.drawMainPath(animation1.pathBrightness)
        if (animation1.grid.goalCell) {
            skeleIdle.show()
            skeleIdle.animate()
        }
        animation1.step()
    } else {
        animation1.drawLightning()
        if (animation1.grid.goalCell) {
            skeleHit.show()
            skeleHit.animate()
        }
        animation1.step()
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
    animation1 = new Animation(0, 0, width, height, flasher, grid, RandomPrims, BreadthFirstSearch)

    resizeSprites(width*0.1)
    if (goalX && goalY) {
        skeleIdle.setPos(goalX, goalY)
        skeleHit.setPos(goalX, goalY)
    }

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