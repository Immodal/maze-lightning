class BreadthFirstSearch {
    constructor(grid, startCell) {
        this.grid = grid

        startCell.setStep(0)
        this.steps = []
        this.origin = new CellMap()
        this.closed = new CellSet()
        this.closed.add(startCell)
        this.queued = new CellSet()
        this.queued.add(startCell)
        this.queue = [startCell]

        this.path = []
        this.pathComplete = 0
    }

    step() {
        const startLength = this.steps.length
        while (this.pathComplete<=0 && startLength == this.steps.length) {
            const cell = this.queue.shift()

            if (this.pathComplete>0 || !cell) return
            else if (this.grid.isGoal(cell)) {
                this.buildPath(cell)
                this.pathComplete = frameCount
            } else {
                for(const n of this.grid.getPathNeighbours(cell)) {
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
        this.path = path
    }
}