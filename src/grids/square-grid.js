class SquareGrid {
    constructor(nc, nr, gx, gy, gw, gh, padding=1) {
        this.nr = nr
        this.nc = nc
        this.cells = new CellSet()
        this.forEach((i, j) => {
            const cell = new SquareCell(i, j)
            // Padding
            if (cell.x<=padding-1 || cell.x>=this.nc-padding 
                    || cell.y<=padding-1 || cell.y>=this.nr-padding) {
                cell.setState(Cell.STATES.PADDING)
            }

            this.cells.add(cell)
        })

        this.gx = gx
        this.gy = gy
        this.gw = gw
        this.gh = gh
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
        return neighbour && neighbour.isState(Cell.STATES.PADDING) ? null : neighbour
    }

    draw(path) {
        const cw = this.gw / this.nc
        const ch = this.gh / this.nr
        stroke(0)
        this.forEach((i, j) => {
            const cell = this.cells.get(i, j)
            if (cell.isState(Cell.STATES.WALL)) fill("#00ff00")
            else if (cell.isState(Cell.STATES.PADDING)) fill("#00ffff")
            else if (cell.isState(Cell.STATES.PATH)) fill(255)
            else if (cell.isState(Cell.STATES.UNVISITED)) fill(150)
            else fill("#ff0000")
            rect(i*cw+this.gx, j*ch+this.gy, cw, ch)
        })

        for (const c of path) {
            fill("#ff00ff")
            rect(c.x*cw+this.gx, c.y*ch+this.gy, cw, ch)
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