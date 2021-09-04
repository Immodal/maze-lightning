class SquareGrid {
    constructor(nc, nr, goalCol, goalRow, tol=0) {
        this.tol=tol
        this.nr = nr
        this.nc = nc
        this.cells = new CellSet()
        this.forEach((i, j) => this.cells.add(new SquareCell(i, j)))
        if (goalCol>=0 && goalRow>=0) {
            const xRange = 20
            this.goalCell = this.cells.get(goalCol, goalRow)
            const startMin = this.goalCell.x - xRange >= 0 ? this.goalCell.x - xRange : 0
            const startMax = this.goalCell.x + xRange < this.nc ? this.goalCell.x + xRange : this.nc-1
            this.startCell = this.cells.get(utils.randInt(startMax, startMin), 0)
        } else {
            this.goalCell = null
            this.startCell = this.cells.get(utils.randInt(this.nc), 0)
        }
    }

    isGoal(cell) {
        if (this.goalCell) return this.goalCell.equals(cell, this.tol)
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

    forEach(callback) {
        for(let i=0; i<this.nc; i++) {
            for(let j=0; j<this.nr; j++) {
                callback(i, j)
            }
        }
    }
}