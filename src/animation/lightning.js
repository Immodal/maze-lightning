class Lightning {
    constructor(gx, gy, gw, gh, flasher, grid, solver) {
        this.gx = gx
        this.gy = gy
        this.gw = gw
        this.gh = gh

        this.flasher = flasher
        this.grid = grid
        this.solver = solver
        this.cw = this.gw / this.grid.nc
        this.ch = this.gh / this.grid.nr
        
        this.complete = false

        this.flashTriggered = false
        this.flashDelay = 0

        this.maxBrightness = 255
        this.fadeLength = 50
        this.fadeDelay = this.flashDelay + this.flasher.fadeLength
        this.waitTime = 10

        this.searchLength = 25
        this.searchMaxBrightness = 100
        this.searchMaxAlpha = 1

        this.arcStart = new CellMap()
        this.arcLength = 50
        this.fadeLength = 50
        this.arcMinAlpha = 0.1
        this.arcMaxAlpha = 0.6
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
        // Lightning Alpha
        let alpha = null
        if (framesElapsed>=this.fadeDelay) {
            alpha = map(framesElapsed-this.fadeDelay, 0, this.fadeLength, 1, 0, true)
        } else {
            alpha = 1
        }
        // Draw lightning
        this.drawMainPath(alpha, 10)

        if (framesElapsed > this.fadeDelay + this.fadeLength) this.complete = true
    }

    drawCell(cell, clr) {
        noStroke()
        fill(clr)
        rect(cell.x*this.cw+this.gx, cell.y*this.ch+this.gy, this.cw, this.ch)
    }

    drawGlow(cell, alpha, glowRange, exclusions) {
        noStroke()
        for (let i=1; i<glowRange; i++ ) {
            const clr = `rgba(0,0,${this.maxBrightness},${map(i,1,glowRange,alpha*0.5,0)})`
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
            const alphaStepMin = p.length>this.arcLength ? p.length-this.arcLength : 0
            const exclusions = new CellSet(p)
            for (let i=alphaStepMin; i<p.length; i++) {
                const alpha = map(i, alphaStepMin, p.length, this.arcMinAlpha, this.arcMaxAlpha)
                this.drawCell(p[i], `rgba(${this.maxBrightness}, ${this.maxBrightness}, ${this.maxBrightness}, ${alpha})`)
                this.drawGlow(p[i], alpha, 2, exclusions)
            }
        }
    }

    drawMainPath(alpha, glowRange=3) {
        const exclusions = new CellSet(this.solver.path)
        for (const c of this.solver.path) {
            this.drawCell(c, `rgba(${this.maxBrightness}, ${this.maxBrightness}, ${this.maxBrightness}, ${alpha})`)
            this.drawGlow(c, alpha, glowRange, exclusions)
        }
    }

    drawSearch(drawAll=false) {
        const brightStepMin = this.solver.steps.length>this.searchLength ? this.solver.steps.length-this.searchLength : 0
        for (let i=drawAll?0:brightStepMin; i<this.solver.steps.length; i++) {
            const alpha = map(i, brightStepMin, this.solver.steps.length, 0, this.searchMaxAlpha)
            for (let j=0; j<this.solver.steps[i].length; j++) {
                this.drawCell(this.solver.steps[i][j], `rgba(${this.searchMaxBrightness},${this.searchMaxBrightness},${this.searchMaxBrightness},${alpha})`)
            }
        }
    }
}