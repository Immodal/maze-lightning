class Skeleton {
    static MODES = {
        HIT: 0,
        IDLE: 1,
        DEAD: 2,
    }

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
        return this.sprites[this.mode].h
    }

    getWidth() {
        return this.sprites[this.mode].w
    }

    getLeftCornerX() {
        return this.x-this.getWidth()/2
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
        this.sprites[this.mode].draw(this.getLeftCornerX(), this.y, i)
    }

    animate() {
        this.sprites[this.mode].animate()
    }

    cycles() {
        return this.sprites[this.mode].cycles
    }

    contains(x, y) {
        const sprite = this.sprites[this.mode]
        const cx = this.getLeftCornerX()
        return x >= cx && x <= cx+sprite.w && y >= this.y && y <= this.y+sprite.h
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