class Cell {
    static STATES = {
        UNVISITED: -1,
        WALL: 0,
        PATH: 1
    }
}


class SquareCell extends Cell {
    static TOP = 1
    static BOTTOM = 2
    static LEFT = 3
    static RIGHT = 4
    static DIRECTIONS = [SquareCell.TOP, SquareCell.BOTTOM, SquareCell.LEFT, SquareCell.RIGHT]

    constructor(x, y, state=SquareCell.STATES.UNVISITED) {
        super()
        this.x = x
        this.y = y
        this.state = state
        this.step = -1
    }

    setStep(step) {
        this.step = step
    }

    setState(state) {
        this.state = state
    }

    isState(state) {
        return this.state == state
    }

    dist(cell) {
        return dist(this.x, this.y, cell.x, cell.y)
    }

    equals(cell, tol=0) {
        return cell && cell.x >= this.x-tol && cell.x <= this.x+tol && cell.y >= this.y-tol && cell.y <= this.y+tol
    }
}


class _CellMap {
    constructor() {
        this._map = new Map()
    }

    delete(x, y) { 
        this._map.delete(this.encode(x, y)) 
    }

    has(x, y) {
        return this._map.has(this.encode(x, y)) 
    }

    get(x, y) {
        return this._map.get(this.encode(x, y))
    }

    size() {
        return this._map.size
    }

    encode(x, y) { 
        if (x instanceof Cell) {
            return this.encode(x.x, x.y) 
        } else {
            return `${x},${y}`
        }
    }
}


class CellSet extends _CellMap {
    constructor(array=[]) {
        super()
        if (array.length>0) {
            this.addAll(array)
        }
    }

    add(cell) {
        this._map.set(this.encode(cell), cell) 
    }

    addAll(arr) {
        arr.forEach(v => this.add(v))
    }
}


class CellMap extends _CellMap {
    constructor() {
        super()
    }

    add(c1, c2) {
        this._map.set(this.encode(c1), c2) 
    }
}