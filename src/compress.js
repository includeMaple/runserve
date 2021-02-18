const {createGzip, createDeflate} = require('zlib')
module.exports = (rs, req, res) => {
  // 从header中提取支持编码
  const acceptEncoding = req.headers['accept-encoding'];
  // 如果header中不存在或者匹配不到服务器支持的压缩编码，则返回原文件
  // \b表示单词边界
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|defalte)\b/)) {
    return rs
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    // 如果客户端支持gizip，我们优先使用gizip进行压缩
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  } else if (acceptEncoding.match(/\bdefalte\b/)) {
    // 如果客户端支持gizip，我们优先使用gizip进行压缩
    res.setHeader('Content-Encoding', 'defalte');
    return rs.pipe(createDeflate());
  }
}