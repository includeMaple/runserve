const yargs = require('yargs');
const process = require('process')
const Server = require('./app')
const argv = yargs
  .usage('anywhere [options]') // 命令行命令，options是命令行参数
  .option('p', { // 键盘输入的值
    alias: 'port', // 全称
    describe: '端口号',
    default: 8519 //默认值，当然其实这里不设置也可以，有设置配置文件
  })
  .option('h',{
    alias: 'hostname',
    describe: 'host',
    default: '127.0.0.1'
  })
  .option('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd()
  })
  .version() // 生成版本信息
  .alias('v', 'version')
  .help() // 帮助信息
  .argv;

  // 1、实例化server对象，并且传入参数
  const server = new Server(argv)
  // 2、启动服务
  server.start()