class BreadthFirstSearch {
    constructor(grid, startCell) {
        this.grid = grid

        this.origin = new CellMap()
        this.closed = new CellSet()
        this.closed.add(startCell)
        this.queued = new CellSet()
        this.queued.add(startCell)
        this.queue = [startCell]

        this.path = []
        this.pathComplete = false
    }

    step() {
        const cell = this.queue.shift()

        if (this.pathComplete || !cell) return
        else if (this.grid.isGoal(cell)) {
            this.buildPath(cell)
            this.pathComplete = true
        } else {
            for(const n of this.grid.getPathNeighbours(cell)) {
                if (!this.queued.has(n)) {
                    this.origin.add(n, cell)
                    this.closed.add(cell)
                    this.queue.push(n)
                    this.queued.add(n)
                }
            }
            this.buildPath(cell)
        }
    }

    buildPath(cell) {
        const path = [cell]
        let c = cell
        while (c) {
            c = this.origin.get(c)
            if (c) path.push(c)
        }
        path.reverse()
        this.path = path
    }
}