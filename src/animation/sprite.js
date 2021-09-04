// https://editor.p5js.org/codingtrain/sketches/vhnFx1mml
class Sprite {
    constructor(spriteSheet, len, speed=1, mirror=false) {
        this.len = len
        this.spriteSheet = spriteSheet
        this.resetFrames()

        this.mirror = mirror
        this.speed = speed
        this.index = 0
        this.cumulativeIndex = 0
        this.cycles = 0
    }
  
    draw(x, y, i=null) {
        if (this.mirror) {
            push()
            scale(-1,1)
            image(this.frames[i ? i : this.index], -x-this.w, y)
            pop()
        } else {
            image(this.frames[i ? i : this.index], x, y)
        }
    }
  
    animate() {
        const i = this.index
        this.cumulativeIndex += this.speed
        if (this.cumulativeIndex>=1) {
            this.index = floor(this.index + this.cumulativeIndex) % this.len
            this.cumulativeIndex = 0
        }
        
        if (i>0 && this.index==0) this.cycles += 1
    }

    resize(w, h) {
        this.resetFrames()
        for (const f of this.frames) {
            f.resize(w, h)
        }
        this.w = this.frames[0].width
        this.h = this.frames[0].height
    }

    resetAnimation() {
        this.index = 0
        this.cycles = 0
    }

    resetFrames() {
        this.frames = []
        this.ow = this.spriteSheet.width/this.len
        this.oh = this.spriteSheet.height
        for (let i = 0; i < this.len; i++) {
            this.frames.push(this.spriteSheet.get(i*this.ow, 0, this.ow, this.oh))
        }

        this.w = this.frames[0].width
        this.h = this.frames[0].height
    }
}