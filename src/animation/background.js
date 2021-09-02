class Background {
    constructor() {
        this._resetLayers()
    }

    draw(i=null, shake=false) {
        const drawLayer = l => {
            const xShake = shake ? Math.random() * 10 - 5 : 0
            const yShake = shake ? Math.random() * 10 - 5 : 0
            image(this.layers[l], x+xShake, yShake+this.layersYOffset[l])
        }
        const x = width/2 - this.layers[0].width/2
        // offset so always centered
        if (i!==null && i>=0) {
            drawLayer(i)
        } else {
            for (let j=0; j<this.layers.length; j++) {
                drawLayer(j)
            }
        }
    }

    resize(w) {
        this._resetLayers()
        const owMax = this.layers.reduce((p, c) => p.width > c.width ? p : c).width
        for (const l of this.layers) {
            l.resize(w*l.width/owMax, 0)
        }
    }

    _resetLayers() {
        this.layers = [
            utils.copyImage(BACKGROUND0.img),
            utils.copyImage(BACKGROUND1.img)
        ]
        this.layersYOffset = [0, 100]
    }
}