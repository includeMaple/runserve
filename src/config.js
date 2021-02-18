module.exports = {
    hostname: '127.0.0.1',
    port: 8000,
    root: process.cwd(),
    compress: /\.(html|js|css|md)/,
    cache: {
        // 配置缓存时间，这里单位是秒
        maxAge: 60,
        // 是否支持，true表示支持
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true
    }
}
