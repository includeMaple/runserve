const http = require('http');
const path = require('path');
const router = require('./router/router.js')
// 引入配置文件
const config = require('./config')
const process = require('process')
const defaultReqURL = ['/favicon.ico', '/main.css', '/main.js']
const openUrl = require('./tools/open')


class Server {
  constructor (conf) {
    // 合并config
    this.config = Object.assign({}, config, conf)
  }
  // start方法作为启动server的方法，我们不能直接启动
  start () {
    // 创建http实例
    const server = http.createServer((req, res) => {
      // 获取用户请求路径
      const url = req.url;
      // 需要将所有config改为this.config
      const filePath = path.join(this.config.root,url)
      // 路径有几种情况：1、不存在404， 2、是一个文件：要读取文件 3、是路径：要返回路径下的文件目录
      // router里也使用了config，是直接从配置文件获取的，需要改为传递入this.config
      router(req, res, filePath, url, this.config)
    });
    // 监听主机和端口
    server.listen(this.config.port, this.config.hostname, () => {
      const url = `http://${this.config.hostname}:${this.config.port}/`;
      console.log(`Server running at ${url}`);
      openUrl(url);
    });
  }
}

// 然后我们做一个输出
// 然后我们需要在index中引用，从逻辑上看，这里有点绕来绕去，为什么不直接在app.js中使用，而是要这样绕一圈呢
// 因为这样有一个好处，这个包既可以用cli工具使用，也可以向其他包一样，require使用，也就是说，从功能上说
// 1、如果我们要引用这个项目使用，只需要引用到app.js
// 2、如果使用cli工具，就是index.js，所有有关cli工具的代码都在index上
// 而使用app.js的方法显而易见
// 1、实例化server，可以传入config也可以不传config
// 2、调取start方法
module.exports = Server;