# alioss-uploader

aliyun oss 上传脚本

支持glob格式文件路径匹配 [node-glob](https://github.com/isaacs/node-glob)

.uploader.js
```js
var AliossUploader = require('alioss-uploader');

var upload = new AliossUploader({
  buildPath: './dist/**/*.{js,css,ico,png}',
  region: 'oss-cn-beijing',
  accessKeyId: 'xxxxxxxxxxxxxxxx',
  accessKeySecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  bucket: 'my-bucket',
  internal: true,
  deleteAll: false,
  generateObjectPath: function(filename, file) {
    return 'projectName/' + file.replace('./dist/', '');
  },
  getObjectHeaders: function(filename) {
    return {
      Expires: 20000,
    }
  },
});

upload.start()
```
