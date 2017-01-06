/**
 * Created by chen on 2017/1/6.
 */

const isVideo = require('is-video');
const async = require('async');
const path = require('path');
const {
  readdir,
  stat
} = require('fs')

const dirList = [];

function isDir(path) {
  "use strict";
  let dirLength;
  readdir(path, function(err, files) {
    dirLength = files.length;
    async.each(files, function(file, cb) {
      let filePath = path.join(path, file);
      stat(filePath, function (err, stats) {
        //如果是文件夹，加入dirList，递归查询
        if(stats.isDirectory()) {
          dirList.push(filePath);
          isDir(filePath);
        }
      })
    }, function(err) {

    })
  });
}
