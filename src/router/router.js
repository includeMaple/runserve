const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path')
const mime = require('./mime.js')
const compress = require('../compress');
const Handlerbars = require('handlebars')
const range = require('../range')
const isFresh = require('../tools/cache')
const tplPath = path.join(__dirname, '../templates/dir.tpl')
// 这里之所以使用同步读写是因为两方面原因
// 1、下面的语句需要执行必须要这句话执行完
// 2、根据node执行原理可以知道，这只会读取一次，后续都将使用缓存
const source = fs.readFileSync(tplPath);
const template = Handlerbars.compile(source.toString())

module.exports = async function fn(req, res, filePath, url, config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      res.statusCode = 200;
      let contentType = mime(filePath)['contentType']
      res.setHeader('Content-Type', contentType);
      if (isFresh(stats, req, res)) {
        res.statusCode = 304;
        // 什么都不做直接返回内容
        res.end()
        return;
      }
      // fs.createReadStream(filePath).pipe(res);
      let rs;
      let {code, start, end} = range(stats.size, req, res)
      if (code === 200) {
        rs = fs.createReadStream(filePath)
      } else if (code === 206) {
        // {start, end}相当于{start:start, end: end}，ES6语法
        rs = fs.createReadStream(filePath, {start, end})
      }
      // 只有匹配到的文件类型进行压缩
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      dir = (url === '/') ? null : url
      data = {
        title: path.basename(filePath),
        dir: dir,
        files: files.map((value, index, arr) => {
          return {
            fileName: value,
            contentType: mime(`${filePath}/${value}`)['contentType']
          }
        })
      }
      res.end(template(data));
    }
  } catch(err) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(err.toString());
  }
}

