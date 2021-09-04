class Npc {
    static LEFT = 'LEFT'
    static CENTER = 'CENTER'
    static RIGHT = 'RIGHT'

    static MODES = {
        HIT: 'HIT',
        IDLE: 'IDLE',
        DEAD: 'DEAD',
        REVIVE: 'REVIVE',
        WALK: 'WALK',
    }

    constructor(x, y, mode=Npc.MODES.IDLE, direction=Npc.LEFT) {
        this.x = x
        this.y = y
        this.mode = mode
        this.direction = direction
        this._loadSprites()

        this.walkSpeed = 1
        this.moveTargetX = null
        this.moveTargetY = null
    }

    _loadSprites() {} // Implement

    isPatrolling() {
        return this.mode==Npc.MODES.IDLE || this.mode==Npc.MODES.WALK
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
        if (this.mode==Npc.MODES.HIT) {
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
                this.setMode(Npc.MODES.IDLE)
                this.moveTargetX = null
                this.moveTargetY = null
            } else {
                let xMove = 0
                this.setMode(Npc.MODES.WALK)
                if (this.moveTargetX<this.x) {
                    xMove = -this.walkSpeed
                    this.direction = Npc.LEFT
                } else if (this.moveTargetX>this.x) {
                    xMove = this.walkSpeed
                    this.direction = Npc.RIGHT
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
        for (const d in this.sprites) {
            for (const s in this.sprites[d]) {
                owMax = this.sprites[d][s].ow > owMax ? this.sprites[d][s].ow : owMax
                this.sprites[d][s].resize(w*this.sprites[d][s].ow/owMax, 0)
            }
        }
        for (const d in this.sprites) {
            for (const s in this.sprites[d]) {
                this.sprites[d][s].resize(w*this.sprites[d][s].ow/owMax, 0)
            }
        }
    }
}


class Skeleton extends Npc {
    _loadSprites() {
        this.sprites = { [`${Npc.LEFT}`]:{}, [`${Npc.RIGHT}`]:{}, [`${Npc.CENTER}`]:{} }
        this.sprites[Npc.RIGHT][Npc.MODES.HIT] = new Sprite(SKELEHIT.img, SKELEHIT.frames)
        this.sprites[Npc.RIGHT][Npc.MODES.IDLE] = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0.25)
        this.sprites[Npc.RIGHT][Npc.MODES.DEAD] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames)
        this.sprites[Npc.RIGHT][Npc.MODES.REVIVE] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 0.25, false, true, [0])
        this.sprites[Npc.RIGHT][Npc.MODES.WALK] = new Sprite(SKELEWALK.img, SKELEWALK.frames, 0.5)

        this.sprites[Npc.LEFT][Npc.MODES.HIT] = new Sprite(SKELEHIT.img, SKELEHIT.frames, 1, true)
        this.sprites[Npc.LEFT][Npc.MODES.IDLE] = new Sprite(SKELEIDLE.img, SKELEIDLE.frames, 0.25, true)
        this.sprites[Npc.LEFT][Npc.MODES.DEAD] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 1, true)
        this.sprites[Npc.LEFT][Npc.MODES.REVIVE] = new Sprite(SKELEDEAD.img, SKELEDEAD.frames, 0.25, true, true, [0])
        this.sprites[Npc.LEFT][Npc.MODES.WALK] = new Sprite(SKELEWALK.img, SKELEWALK.frames, 0.5, true)
    }
}

class Ghost extends Npc {
    _loadSprites() {
        this.sprites = { [`${Npc.LEFT}`]:{}, [`${Npc.RIGHT}`]:{}, [`${Npc.CENTER}`]:{} }
        this.sprites[Npc.LEFT][Npc.MODES.IDLE] = new Sprite(GHOSTIDLE.img, GHOSTIDLE.frames, 0.2, true)
    }

    draw(alpha=255) {
        if (alpha<255) tint(255, alpha)
        super.draw()
        noTint()
    }
}