utils = {}
// Non inclusive max
utils.randInt = (max, min=0) => Math.floor(Math.random() * (max - min)) + min
utils.randSplice = arr => {
    const result = arr.splice(utils.randInt(arr.length), 1)
    return result.length > 0 ? result[0] : null
}

utils.copyImage = (img) => img.get(0, 0, img.width, img.height)