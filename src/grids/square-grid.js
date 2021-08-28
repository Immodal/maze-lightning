class SquareGrid {
    constructor(nc, nr, gx, gy, gw, gh) {
        this.nr = nr
        this.nc = nc
        this.cells = new CellSet()
        this.forEach((i, j) => this.cells.add(new SquareCell(i, j)))

        this.gx = gx
        this.gy = gy
        this.gw = gw
        this.gh = gh

        this.animationComplete = false
    }

    isGoal(cell) {
        return cell.y == this.nr-1
    }

    getCellDirs() {
        return SquareCell.DIRECTIONS
    }

    getRandomUnvisitedNeighbour(cell) {
        let ns = this.getUnvisitedNeighbours(cell)
        return ns.length ? ns[Math.floor(Math.random()*ns.length)] : null
    }

    getUnvisitedNeighbours(cell) {
        return this.getNeighbours(cell).filter(v => v.isState(Cell.STATES.UNVISITED))
    }

    getPathNeighbours(cell) {
        return this.getNeighbours(cell).filter(v => v.isState(Cell.STATES.PATH))
    }

    getNeighbours(cell) {
        const ns = []
        for (const d of SquareCell.DIRECTIONS) {
            const n = this.getNeighbour(cell, d)
            if (n) ns.push(n)
        }
        return ns
    }

    getNeighbour(cell, dir) {
        const x = cell.x
        const y = cell.y
        let neighbour = null
        if (dir==SquareCell.TOP) neighbour = this.cells.get(x, y-1)
        else if (dir==SquareCell.BOTTOM) neighbour = this.cells.get(x, y+1)
        else if (dir==SquareCell.LEFT) neighbour = this.cells.get(x-1, y)
        else if (dir==SquareCell.RIGHT) neighbour = this.cells.get(x+1, y)
        return neighbour
    }

    draw(solver, debug=false) {
        const cw = this.gw / this.nc
        const ch = this.gh / this.nr

        if (debug) {
            stroke(0)
            this.forEach((i, j) => {
                const cell = this.cells.get(i, j)
                if (cell.isState(Cell.STATES.WALL)) fill("#00ff00")
                else if (cell.isState(Cell.STATES.PATH)) fill(255)
                else if (cell.isState(Cell.STATES.UNVISITED)) fill(150)
                else fill("#ff0000")
                rect(i*cw+this.gx, j*ch+this.gy, cw, ch)
            })
        }

        strokeWeight(1)
        if (solver.pathComplete>0) {
            const flashLength = 10
            const framesSinceCompletion = frameCount - solver.pathComplete
            background(map(framesSinceCompletion, 0, flashLength, 255, 0))
            const fadeLength = 50
            const framesSinceFlashEnd = framesSinceCompletion - flashLength
            if (framesSinceFlashEnd>=0) {
                const clr = map(framesSinceFlashEnd, 0, fadeLength, 255, 0)
                fill(clr)
                stroke(clr)
            } else {
                fill(255)
                stroke(255)
            }

            for (const c of solver.path) {
                rect(c.x*cw+this.gx, c.y*ch+this.gy, cw, ch)
            }

            const waitTime = 10
            const framesSinceFadeEnd = framesSinceFlashEnd - fadeLength - waitTime
            if (framesSinceFadeEnd>=0) this.animationComplete = true
        } else {
            background(0)
            const tailLength = 30
            const brightStepMin = solver.steps.length>tailLength ? solver.steps.length-tailLength : 0
            for (let i=brightStepMin; i<solver.steps.length; i++) {
                const brightness = map(i, brightStepMin, solver.steps.length, 0, 20)
                for (let j=0; j<solver.steps[i].length; j++) {
                    const c = solver.steps[i][j]
                    stroke(brightness)
                    fill(brightness)
                    rect(c.x*cw+this.gx, c.y*ch+this.gy, cw, ch)
                }
            }
        }
    }

    forEach(callback) {
        for(let i=0; i<this.nc; i++) {
            for(let j=0; j<this.nr; j++) {
                callback(i, j)
            }
        }
    }
}