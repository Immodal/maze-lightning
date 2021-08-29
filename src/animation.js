class Animation {
    constructor(nc, nr, gx, gy, gw, gh, flasher, Grid, Generator, Solver) {
        this.gx = gx
        this.gy = gy
        this.gw = gw
        this.gh = gh

        this.flasher = flasher
        this.grid = new Grid(nc, nr)
        this.cw = this.gw / this.grid.nc
        this.ch = this.gh / this.grid.nr

        this.generator = new Generator(this.grid)
        this.generator.run()
        this.solver = new Solver(this.grid)
        
        this.complete = false

        this.flashTriggered = false
        this.flashDelay = 0

        this.pathBrightness = 200
        this.maxBrightness = 255
        this.fadeLength = 50
        this.fadeDelay = this.flashDelay + this.flasher.fadeLength
        this.waitTime = 10

        this.searchLength = 25
        this.searchMaxBrightness = 100

        this.arcStart = new CellMap()
        this.arcLength = 50
        this.fadeLength = 50
        this.arcMinBrightness = 0
        this.arcMaxBrightness = 100
    }

    step() {
        this.solver.step()
    }

    isSearching() {
        return this.solver.pathComplete<=0
    }

    drawDebug() {
        const cw = this.gw / this.grid.nc
        const ch = this.gh / this.grid.nr
        stroke(0)
        this.grid.forEach((i, j) => {
            const cell = this.cells.get(i, j)
            if (cell.isState(Cell.STATES.WALL)) fill("#00ff00")
            else if (cell.isState(Cell.STATES.PATH)) fill(255)
            else if (cell.isState(Cell.STATES.UNVISITED)) fill(150)
            else fill("#ff0000")
            rect(i*cw+this.gx, j*ch+this.gy, cw, ch)
        })
    }

    drawLightning() {
        strokeWeight(1)
        const cw = this.gw / this.grid.nc
        const ch = this.gh / this.grid.nr
        const framesElapsed = frameCount - this.solver.pathComplete
        // Trigger Flash
        if (!this.flashTriggered && framesElapsed>=this.flashDelay) {
            this.flashTriggered = true
            this.flasher.trigger()
        }
        // Lightning Brightness
        if (framesElapsed>=this.fadeDelay) {
            const clr = map(framesElapsed-this.fadeDelay, 0, this.fadeLength, this.maxBrightness, 0)
            fill(clr)
            stroke(clr)
        } else {
            fill(this.maxBrightness)
            stroke(this.maxBrightness)
        }
        // Draw lightning
        for (const c of this.solver.path) {
            rect(c.x*cw+this.gx, c.y*ch+this.gy, cw, ch)
        }

        if (framesElapsed > this.fadeDelay + this.fadeLength) this.complete = true
    }

    drawCell(cell, brightness) {
        strokeWeight(1)
        stroke(brightness)
        fill(brightness)
        rect(cell.x*this.cw+this.gx, cell.y*this.ch+this.gy, this.cw, this.ch)
    }

    drawArcs() {
        for (const p of this.solver.deadendPaths) {
            if (!this.arcStart.has(p[p.length-1])) this.arcStart.add(p[p.length-1], frameCount)
            const brightStepMin = p.length>this.arcLength ? p.length-this.arcLength : 0
            //const framesElapsed = frameCount - this.arcStart.get(p[p.length-1])
            //const drawLength = framesElapsed >= p.length ? p.length : framesElapsed
            for (let i=brightStepMin; i<p.length; i++) {
                const brightness = map(i, brightStepMin, p.length, this.arcMinBrightness, this.arcMaxBrightness)
                this.drawCell(p[i], brightness)
            }
        }
    }

    drawMainPath() {
        for (const c of this.solver.path) {
            this.drawCell(c, this.pathBrightness)
        }
    }

    drawSearch() {
        const brightStepMin = this.solver.steps.length>this.searchLength ? this.solver.steps.length-this.searchLength : 0
        for (let i=brightStepMin; i<this.solver.steps.length; i++) {
            const brightness = map(i, brightStepMin, this.solver.steps.length, 0, this.searchMaxBrightness)
            for (let j=0; j<this.solver.steps[i].length; j++) {
                this.drawCell(this.solver.steps[i][j], brightness)
            }
        }
    }
}