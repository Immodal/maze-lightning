class Skeleton {
    static MODES = {
        HIT: 0,
        IDLE: 1,
        DEAD: 2,
    }

    static HEIGHT_ADJUSTMENT = 0.67

    constructor(x, y) {
        this.x = x
        this.y = y
        this.mode = Skeleton.MODES.IDLE
        this.sprites = {}
        this.sprites[Skeleton.MODES.HIT] = new Sprite(SKELEHIT.img, SKELEHIT.frames)
        this.sprites[Skeleton.MODES.IDLE] = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0.5)
        this.sprites[Skeleton.MODES.DEAD] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames)
    }

    getHeight() {
        return this.sprites[0].frames[0].height*Skeleton.HEIGHT_ADJUSTMENT
    }

    setPos(x, y) {
        this.x = x
        this.y = y
    }

    setMode(mode) {
        if (this.mode == mode) return 
        this.mode = mode
        this.sprites[this.mode].resetAnimation()
    }

    draw(i=null) {
        this.sprites[this.mode].draw(this.x, this.y, i)
    }

    animate() {
        this.sprites[this.mode].animate()
    }

    cycles() {
        return this.sprites[this.mode].cycles
    }

    resize(w) {
        let owMax = 0
        for (const s in this.sprites) {
            owMax = this.sprites[s].ow > owMax ? this.sprites[s].ow : owMax
        }
        for (const s in this.sprites) {
            this.sprites[s].resize(w*this.sprites[s].ow/owMax, 0)
        }
    }
}