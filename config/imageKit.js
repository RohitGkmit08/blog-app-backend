

let ImageKit = require("imagekit")
let imageKit = new ImageKit({
    publicKey : process.env.IMAGE_KIT_PUBLIC,
    privateKey : process.env.IMAGE_KIT_PVT,
    urlEndpoint : process.env.IMAGE_KIT_ENDPT
})

module.exports = imageKit;
