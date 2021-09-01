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