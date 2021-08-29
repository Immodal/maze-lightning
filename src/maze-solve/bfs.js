class BreadthFirstSearch {
    constructor(grid) {
        this.grid = grid

        this.grid.startCell.setStep(0)
        this.steps = []
        this.origin = new CellMap()
        this.closed = new CellSet()
        this.closed.add(this.grid.startCell)
        this.queued = new CellSet()
        this.queued.add(this.grid.startCell)
        this.queue = [this.grid.startCell]

        this.path = []
        this.pathComplete = 0

        this.deadendRateMin = 0.02
        this.deadendRateMax = 0.04
        this.deadends = []
        this.deadendPaths = []
    }

    step() {
        const startLength = this.steps.length
        while (this.pathComplete<=0 && startLength == this.steps.length) {
            const cell = this.queue.shift()

            if (this.pathComplete>0 || !cell) return
            else if (this.grid.isGoal(cell)) {
                this.path = this.buildPath(cell)
                this.pathComplete = frameCount
            } else {
                const ns = this.grid.getPathNeighbours(cell)
                if (ns.length==1) {
                    this.deadends.push(cell)
                    if (Math.random() < map(this.closed.size(), 0, this.grid.cells.size(), this.deadendRateMin, this.deadendRateMax)) {
                        this.deadendPaths.push(this.buildPath(cell))
                    }
                }
                for(const n of ns) {
                    if (!this.queued.has(n)) {
                        this.origin.add(n, cell)
                        this.closed.add(cell)
                        this.queue.push(n)
                        this.queued.add(n)
    
                        n.setStep(cell.step+1)
                        if (this.steps.length<=n.step) this.steps.push([n])
                        else this.steps[n.step].push(n)
                    }
                }
                this.path = this.buildPath(cell)
            }
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
        return path
    }
}