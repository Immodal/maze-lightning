class Lightning {
    constructor(gx, gy, gw, gh, flasher, grid, Generator, Solver) {
        this.gx = gx
        this.gy = gy
        this.gw = gw
        this.gh = gh

        this.flasher = flasher
        this.grid = grid
        this.cw = this.gw / this.grid.nc
        this.ch = this.gh / this.grid.nr

        this.generator = new Generator(this.grid)
        this.generator.run()
        this.solver = new Solver(this.grid)
        
        this.complete = false

        this.flashTriggered = false
        this.flashDelay = 0

        this.pathBrightness = 255
        this.maxBrightness = 255
        this.fadeLength = 50
        this.fadeDelay = this.flashDelay + this.flasher.fadeLength
        this.waitTime = 10

        this.glowBrightness = 100

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

    isStalled() {
        return this.solver.noPath()
    }

    isSearching() {
        return this.solver.pathComplete<=0
    }

    drawDebug() {
        const cw = this.gw / this.grid.nc
        const ch = this.gh / this.grid.nr
        stroke(0)
        this.grid.forEach((i, j) => {
            const cell = this.grid.cells.get(i, j)
            if (cell.isState(Cell.STATES.WALL)) fill("#00ff00")
            else if (cell.isState(Cell.STATES.PATH)) fill(255)
            else if (cell.isState(Cell.STATES.UNVISITED)) fill(150)
            else fill("#ff0000")
            rect(i*cw+this.gx, j*ch+this.gy, cw, ch)
        })
    }

    drawLightning() {
        const framesElapsed = frameCount - this.solver.pathComplete
        // Trigger Flash
        if (!this.flashTriggered && framesElapsed>=this.flashDelay) {
            this.flashTriggered = true
            this.flasher.trigger()
        }
        // Lightning Brightness
        let clr = null
        if (framesElapsed>=this.fadeDelay) {
            clr = Math.floor(map(framesElapsed-this.fadeDelay, 0, this.fadeLength, this.maxBrightness, 0, true))
        } else {
            clr = this.maxBrightness
        }
        // Draw lightning
        this.drawMainPath(clr, 10)

        if (framesElapsed > this.fadeDelay + this.fadeLength) this.complete = true
    }

    drawCell(cell, clr) {
        stroke(clr)
        fill(clr)
        rect(cell.x*this.cw+this.gx, cell.y*this.ch+this.gy, this.cw, this.ch)
    }

    drawGlow(cell, brightness, glowRange, exclusions) {
        noStroke()
        for (let i=1; i<glowRange; i++ ) {
            const clr = `rgba(0,0,${brightness},${map(i,1,glowRange,0.5,0)})`
            fill(clr)
            if (cell.x+i<this.grid.nc && !exclusions.has(cell.x+i, cell.y)) {
                rect((cell.x+i)*this.cw+this.gx, cell.y*this.ch+this.gy, this.cw, this.ch)
            }
            if (cell.x-i>0 && !exclusions.has(cell.x-i, cell.y)) {
                rect((cell.x-i)*this.cw+this.gx, cell.y*this.ch+this.gy, this.cw, this.ch)
            }
            if (cell.y+i<this.grid.nr && !exclusions.has(cell.x, cell.y+i)) {
                rect(cell.x*this.cw+this.gx, (cell.y+i)*this.ch+this.gy, this.cw, this.ch)
            }
            if (cell.y-i>0 && !exclusions.has(cell.x, cell.y-i)) {
                rect(cell.x*this.cw+this.gx, (cell.y-i)*this.ch+this.gy, this.cw, this.ch)
            }
        }
    }

    drawArcs() {
        for (const p of this.solver.deadendPaths) {
            if (!this.arcStart.has(p[p.length-1])) this.arcStart.add(p[p.length-1], frameCount)
            const brightStepMin = p.length>this.arcLength ? p.length-this.arcLength : 0
            const exclusions = new CellSet(p)
            for (let i=brightStepMin; i<p.length; i++) {
                const brightness = Math.floor(map(i, brightStepMin, p.length, this.arcMinBrightness, this.arcMaxBrightness))
                this.drawCell(p[i], brightness)
                this.drawGlow(p[i], brightness, 2, exclusions)
            }
        }
    }

    drawMainPath(brightness, glowRange=3) {
        const exclusions = new CellSet(this.solver.path)
        for (const c of this.solver.path) {
            this.drawCell(c, brightness)
            this.drawGlow(c, brightness, glowRange, exclusions)
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