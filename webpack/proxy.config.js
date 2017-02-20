module.exports = {
  '/service': {
    target: 'http://ip.taobao.com/service/getIpInfo.php',
    changeOrigin: true,
    secure: false
  }
}

