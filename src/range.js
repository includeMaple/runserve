module.exports = (totalZize, req, res) => {
  // 上述三个参数分别表示文件总大小，请求，响应
  // 在请求中拿到range信息
  const range = req.headers['range'];
  // 如果header中不存在range，则返回200
  if (!range) {
    return {code: 200};
  }
  // 拿到range中关于start和end的信息，如果没有end取总大小-1，如果没有start，取0
  // 比如：'bytes=10-99'.match(/bytes=(\d*)-(\d*)/)，会得到结果[bytes=10-99, 10, 99, groups: undefined, index: 0, input: "bytes=10-99", length: 3]
  const sizes = range.match(/bytes=(\d*)-(\d*)/);
  const end = sizes[2] || totalZize-1;
  const start = sizes[1] || 0;
  // 异常情况，为了简单处理，这里对这些异常情况直接给浏览器发送所有数据
  if (start>end ||start<0 ||end>totalZize) {
    return {code: 200};
  }
  // 正常情况，设置header信息，返回206
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Range', `btyes ${start}-${end}/${totalZize}`);
  return {
    code: 206,
    start: parseInt(start),
    end: parseInt(end)
  }
}