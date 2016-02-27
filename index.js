"use strict"
var coBody = require('co-body');
var formidable = require('formidable');
var qs = require('qs');
var utils = require('lodash');

module.exports = function(app,opts){
  opts = utils.defaultsDeep(opts,{
    coBody:{},
    formidable : {
      uploadDir : __dirname,
      keepExtensions : true
    },
    qs:{}
  });
  app.use(function*(next){
    if ('POST' != this.method) return yield next;
    if (this.is('json')) {
      this.request.posts = yield coBody.json(this,opts.coBody);
    } else if(this.is('urlencoded')) {
      this.request.posts = yield coBody.form(this,opts.coBody);
    } else if (this.is('text')) {
      this.request.posts = yield coBody.text(this, opts.coBody);
    } else if (this.is('multipart')) {
      var parts = yield multiParse(this, opts);
      this.request.posts = parts.fields;
      this.request.files = parts.files;
    }
    yield next;
  });
}

function multiParse(ctx,opts){
  return new Promise(function(resolve, reject){
    var fields = {};
    var qss = "";
    var files = {};
    var form = new formidable.IncomingForm(opts.formidable);
    form
      .on('end', function() {
        fields = qs.parse(qss,opts.qs);
        resolve({fields: fields, files: files});
      })
      .on('error', function(err) {
        reject(err);
      })
      .on('field', function(field, value) {
        var s = field+'='+encodeURIComponent(value);
        if (qss == ""){
          qss += s;
        } else {
          qss += '&' + s;
        }
      })
      .on('file', function(field, file) {
        if (files[field]) {
          if (Array.isArray(files[field])) {
            files[field].push(file);
          } else {
            files[field] = [files[field], file];
          }
        } else {
          files[field] = file;
        }
      });
    form.parse(ctx.req);
  });
}
