class Flasher {
    constructor() {
        this.fadeLength = 10
        this.maxBrightness = 200

        this.start = 0
        this.go = false
    }

    draw() {
        if(this.go) {
            this.start = frameCount
            this.go = false
        }

        if (this.start>0 && frameCount-this.start<this.fadeLength) {
            fill(`rgba(${this.maxBrightness}, ${this.maxBrightness}, ${this.maxBrightness}, ${this.getAlpha()})`)
            rect(0, 0, width, height)
        }
    }

    trigger() {
        this.go = true
    }

    getAlpha() {
        return map(frameCount - this.start, 0, this.fadeLength, 1, 0)
    }
}