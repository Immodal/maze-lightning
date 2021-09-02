class Astar extends BreadthFirstSearch {
    constructor(grid, h1) {
        super(grid)
        this.h1 = h1
    }

    sortQueue() {
        this.queue.sort((a, b) => {
            if (this.score(a) > this.score(b)) return 1
            else if (this.score(a) == this.score(b)) return 0
            else return -1
        })
    }

    score(cell) {
        let goal = null
        if (this.grid.goalCell) {
            goal = this.grid.goalCell
        } else {
            goal = this.grid.cells.get(cell.x, this.grid.nr-1)
        }
        return cell.step + cell.dist(goal) * this.h1
    }
}