const path = require('path')
const mime = {
  txt: {
    contentType:'text/plain',
    url: './aaa'
  },
  jpg: {
    contentType: 'image/jpeg',
    url: './bbb'
  },
  js: {
    contentType: 'application/x-javascript',
    url: './ccc'
  },
  css: {
    contentType: 'text/css',
    url: './ddd'
  },
  html: {
    contentType: 'text/html',
    url: './dd'
  }
}
module.exports = (filePath) => {
  let ext = path.extname(filePath)
  .split('.')
  .pop()
  .toLowerCase()
  // 有的文件本来就没有拓展名，所以拓展名是文件本身
  ext = ext ? ext : filePath
  let mimeInfo = mime[ext] || mime['txt']
  return {
    contentType: mimeInfo['contentType'],
    url: mimeInfo['url']
  }
}
