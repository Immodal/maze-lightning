class Flasher {
    constructor() {
        this.fadeLength = 10
        this.maxBrightness = 100

        this.start = this.fadeLength
        this.go = false
    }

    draw() {
        if(this.go) {
            this.start = frameCount
            this.go = false
        }

        if (frameCount - this.start<this.fadeLength) {
            background(this.getBrightness())
        } else {
            background(0)
        }
    }

    trigger() {
        this.go = true
    }

    getBrightness() {
        return map(frameCount - this.start, 0, this.fadeLength, this.maxBrightness, 0)
    }
}