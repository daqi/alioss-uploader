'use strict';
var oss = require('ali-oss');
var glob = require('glob');

function AliossUploader(options) {
  if (
    !options ||
    !options.buildPath ||
    !options.region ||
    !options.accessKeyId ||
    !options.accessKeySecret ||
    !options.bucket
  ) {
    throw new Error('缺少参数！');
  }
  this.options = Object.assign({}, options);
}

AliossUploader.prototype.start = function() {
  var _this = this;
  var deleteAll = _this.options.deleteAll || false;
  var generateObjectPath =
    _this.options.generateObjectPath ||
    function(fileName) {
      return fileName;
    };
  var getObjectHeaders =
    _this.options.getObjectHeaders ||
    function() {
      return {};
    };

  var store = oss({
    region: _this.options.region,
    accessKeyId: _this.options.accessKeyId,
    accessKeySecret: _this.options.accessKeySecret,
    bucket: _this.options.bucket,
    internal: _this.options.internal ? true : false,
  });

  Promise.resolve()
    .then(function() {
      //删除oss上代码
      if (deleteAll) {
        return store.list().then(function(fileList) {
          var files = [];
          var res = [];
          if (fileList.objects) {
            res = fileList.objects.map(function(file) {
              return store.deleteMulti(files, {
                quiet: true,
              });
            });
          }
          return Promise.all(res);
        });
      }
      return;
    })
    .then(function() {
      //上传oss的新代码
      var fileArray = [];
      glob.sync(_this.options.buildPath, { nodir: true }).forEach(function(filename) {
        fileArray.push(filename);
      });

      fileArray.forEach(function(file) {
        var fileName = file.split('/').pop();
        var ossFileName = generateObjectPath(fileName, file);
        if (ossFileName) {
          store
            .put(ossFileName, file, {
              headers: getObjectHeaders(fileName),
            })
            .then(function() {
              console.log(file + ' -- upload to ' + ossFileName + ' success');
            });
        } else {
          console.log('skipping file ' + file);
        }
      });
    })
    .catch(function(err) {
      console.info(err);
    });
};

module.exports = AliossUploader;
