import fs from 'fs'

export default {
  server: {
    // localhost対応 参考:https://github.com/vitejs/vite/discussions/3396
    host: true,
    // https対応 参考:https://dev.classmethod.jp/articles/vite-https-localhost/
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    }
  },
}