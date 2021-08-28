class RandomPrims {
    constructor(grid, startCell) {
        this.grid = grid
        this.stack = [startCell]
    }

    step() {
        // Pick random cell out of stack
        const cell = utils.randSplice(this.stack)
        if (!cell) return 

        const ns = this.grid.getNeighbours(cell)
        const unvisiteds = ns.filter(v => v.isState(Cell.STATES.UNVISITED))
        const paths = ns.filter(v => v.isState(Cell.STATES.PATH))

        // Has at most 1 neighbour that is part of the path, make it a path
        if (paths.length <= 1) {
            cell.setState(Cell.STATES.PATH)
            this.stack.push(...unvisiteds)
        // Otherwise it has to be a wall
        } else {
            cell.setState(Cell.STATES.WALL)
        }
    }
}