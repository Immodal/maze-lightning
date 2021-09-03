class Skeleton {
    static MODES = {
        HIT: 0,
        IDLE: 1,
        DEAD: 2,
        WALKLEFT: 3,
        WALKRIGHT: 4,
    }

    constructor(x, y) {
        this.x = x
        this.y = y
        this.mode = Skeleton.MODES.IDLE
        this.sprites = {}
        this.sprites[Skeleton.MODES.HIT] = new Sprite(SKELEHIT.img, SKELEHIT.frames)
        this.sprites[Skeleton.MODES.IDLE] = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0.5)
        this.sprites[Skeleton.MODES.DEAD] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames)
        this.sprites[Skeleton.MODES.WALKLEFT] = new Sprite(SKELEWALKLEFT.img, SKELEWALKLEFT.frames, 0.5)
        this.sprites[Skeleton.MODES.WALKRIGHT] = new Sprite(SKELEWALKRIGHT.img, SKELEWALKRIGHT.frames, 0.5)

        this.walkSpeed = 1
        this.moveTargetX = null
        this.moveTargetY = null
    }

    hasMoveTarget() {
        return this.moveTargetX!==null && this.moveTargetY!==null
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

    moveTo(x, y) {
        this.moveTargetX = x
        this.moveTargetY = y
    }

    setMode(mode) {
        if (this.mode == mode) return 
        this.mode = mode
        this.sprites[this.mode].resetAnimation()
        if (this.mode==Skeleton.MODES.HIT) {
            this.moveTargetX = null
            this.moveTargetY = null
        }
    }

    draw(i=null) {
        this.sprites[this.mode].draw(this.getLeftCornerX(), this.y, i)
    }

    animate() {
        if ((this.mode==Skeleton.MODES.IDLE || this.mode==Skeleton.MODES.WALKLEFT || this.mode==Skeleton.MODES.WALKRIGHT)
            && this.hasMoveTarget()) {
            if (this.contains(this.moveTargetX, this.moveTargetY)) {
                this.setMode(Skeleton.MODES.IDLE)
                this.moveTargetX = null
                this.moveTargetY = null
            } else {
                let xMove = 0
                if (this.moveTargetX<this.x) {
                    xMove = -this.walkSpeed
                    this.setMode(Skeleton.MODES.WALKLEFT)
                } else if (this.moveTargetX>this.x) {
                    xMove = this.walkSpeed
                    this.setMode(Skeleton.MODES.WALKRIGHT)
                }
                const yMove = this.moveTargetY<this.y ? -this.walkSpeed : this.moveTargetY>this.y ? this.walkSpeed : 0
                this.setPos(this.x+xMove, this.y+yMove)
            }
        }
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