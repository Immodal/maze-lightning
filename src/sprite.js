// https://editor.p5js.org/codingtrain/sketches/vhnFx1mml
class Sprite {
    constructor(spriteSheet, len, x, y, speed=1) {
        this.x = x
        this.y = y
        this.len = len
        this.spriteSheet = spriteSheet
        this.resetFrames()

        this.speed = speed;
        this.index = 0;
    }
  
    show() {
        image(this.frames[this.index], this.x, this.y);
    }
  
    animate() {
        this.index = floor(this.index+this.speed) % this.len
    }

    setPos(x, y) {
        this.x = x - this.w/2
        this.y = y - this.h/2
    }

    resize(w, h) {
        this.resetFrames()
        for (const f of this.frames) {
            f.resize(w, h)
        }
        this.w = this.frames[0].width
        this.h = this.frames[0].height
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