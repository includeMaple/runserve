const {cache} = require('../config')
// 添加header
function refreshRes(stats, res) {
  console.log(cache)
  const {maxAge, expires, cacheControl, lastModified, etag} = cache;
  if (expires) {
    // 返回当前时间加上maxAge时间
    res.setHeader('Expires', (new Date(Date.now()+maxAge*1000)).toUTCString())
  }
  if (cacheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }
  if (lastModified) {
    // mtime表示修改时间
    res.setHeader('Last-Modified', stats.mtime.toUTCString());
  }
  if (etag) {
    // etag算法有很多，网上有很多包，这里用了比较简单的大小加上文件的修改时间
    res.setHeader('ETag', `${stats.size}-${stats.mtime}`);
  }
}

module.exports = function isFresh (stats, req, res) {
  refreshRes(stats, res);
  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];
  if (!lastModified && !etag) {
    return false;
  }
  // 发现客户端发过来的和我们刚才在res中设置的不同
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }
  if (etag && etag !== res.getHeader('etag')) {
    return false;
  }
  return true;
}