// https://editor.p5js.org/codingtrain/sketches/vhnFx1mml
class Sprite {
    constructor(spriteSheet, len, speed=1) {
        this.len = len
        this.spriteSheet = spriteSheet
        this.resetFrames()

        this.speed = speed
        this.index = 0
        this.cycles = 0
    }
  
    draw(x, y, i=null) {
        const myX = x - this.w/2
        const myY = y - this.h/3
        image(this.frames[i ? i : this.index], myX, myY)
    }
  
    animate() {
        const i = this.index
        this.index = floor(this.index+this.speed) % this.len
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