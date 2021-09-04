class Skeleton {
    static LEFT = 'LEFT'
    static RIGHT = 'RIGHT'

    static MODES = {
        HIT: 'HIT',
        IDLE: 'IDLE',
        DEAD: 'DEAD',
        REVIVE: 'REVIVE',
        WALK: 'WALK',
    }

    constructor(x, y) {
        this.x = x
        this.y = y
        this.mode = Skeleton.MODES.IDLE
        this.direction = Skeleton.LEFT
        this.sprites = { [`${Skeleton.LEFT}`]:{}, [`${Skeleton.RIGHT}`]:{} }

        this.sprites[Skeleton.RIGHT][Skeleton.MODES.HIT] = new Sprite(SKELEHIT.img, SKELEHIT.frames)
        this.sprites[Skeleton.RIGHT][Skeleton.MODES.IDLE] = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0.25)
        this.sprites[Skeleton.RIGHT][Skeleton.MODES.DEAD] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames)
        this.sprites[Skeleton.RIGHT][Skeleton.MODES.REVIVE] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 0.25, false, true, [0])
        this.sprites[Skeleton.RIGHT][Skeleton.MODES.WALK] = new Sprite(SKELEWALK.img, SKELEWALK.frames, 0.5)

        this.sprites[Skeleton.LEFT][Skeleton.MODES.HIT] = new Sprite(SKELEHIT.img, SKELEHIT.frames, 1, true)
        this.sprites[Skeleton.LEFT][Skeleton.MODES.IDLE] = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0.25, true)
        this.sprites[Skeleton.LEFT][Skeleton.MODES.DEAD] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 1, true)
        this.sprites[Skeleton.LEFT][Skeleton.MODES.REVIVE] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 0.25, true, true, [0])
        this.sprites[Skeleton.LEFT][Skeleton.MODES.WALK] = new Sprite(SKELEWALK.img, SKELEWALK.frames, 0.5, true)

        this.walkSpeed = 1
        this.moveTargetX = null
        this.moveTargetY = null
    }

    isPatrolling() {
        return this.mode==Skeleton.MODES.IDLE || this.mode==Skeleton.MODES.WALK
    }

    hasMoveTarget() {
        return this.moveTargetX!==null && this.moveTargetY!==null
    }

    getSprite(mode=null) {
        if (!mode) {
            return this.sprites[this.direction][this.mode]
        }
        return this.sprites[this.direction][mode]
    }

    getHeight() {
        return this.getSprite().h
    }

    getWidth() {
        return this.getSprite().w
    }

    getLeftCornerX() {
        return this.x-this.getWidth()/2
    }

    setPos(x, y) {
        this.x = x
        this.y = y
    }

    moveTo(x, y) {
        this.moveTargetX = x
        this.moveTargetY = y
    }

    setMode(mode) {
        if (this.mode == mode) return 
        this.mode = mode
        this.getSprite().resetAnimation()
        if (this.mode==Skeleton.MODES.HIT) {
            this.moveTargetX = null
            this.moveTargetY = null
        }
    }

    draw(i=null) {
        this.getSprite().draw(this.getLeftCornerX(), this.y, i)
    }

    animate() {
        if (this.isPatrolling() && this.hasMoveTarget()) {
            if (this.contains(this.moveTargetX, this.moveTargetY)) {
                this.setMode(Skeleton.MODES.IDLE)
                this.moveTargetX = null
                this.moveTargetY = null
            } else {
                let xMove = 0
                this.setMode(Skeleton.MODES.WALK)
                if (this.moveTargetX<this.x) {
                    xMove = -this.walkSpeed
                    this.direction = Skeleton.LEFT
                } else if (this.moveTargetX>this.x) {
                    xMove = this.walkSpeed
                    this.direction = Skeleton.RIGHT
                }
                const yMove = this.moveTargetY<this.y ? -this.walkSpeed : this.moveTargetY>this.y ? this.walkSpeed : 0
                this.setPos(this.x+xMove, this.y+yMove)
            }
        }
        this.getSprite().animate()
    }

    cycles() {
        return this.getSprite().cycles
    }

    contains(x, y) {
        const sprite = this.getSprite()
        const cx = this.getLeftCornerX()
        return x >= cx && x <= cx+sprite.w && y >= this.y && y <= this.y+sprite.h
    }

    resize(w) {
        let owMax = 0
        for (const s in this.sprites[Skeleton.RIGHT]) {
            owMax = this.sprites[Skeleton.RIGHT][s].ow > owMax ? this.sprites[Skeleton.RIGHT][s].ow : owMax
        }
        for (const d in this.sprites) {
            for (const s in this.sprites[d]) {
                this.sprites[d][s].resize(w*this.sprites[d][s].ow/owMax, 0)
            }
        }
    }
}