简介
----

一个用来解析表单提交数据的中间件，适合 koa 1.x ，通过对 [co-body][1] [formidable][2] 的封装实现 urlencoded、json、text 和 multipart类型的表单解析。
支持嵌套的数组类型字段解析。

    a[b]=1&a[c]=2

会解析成

    { "a":{"b":1,"c":2} }

使用了[qs][3]包，主要针对的是formdiable，co-body则默认支持。

安装
-----

    npm install koa-formparser --save

使用
-----

    var app = require('koa');
    var formparser = require('koa-formparser');

    //formparser(app,opts);
    formparser(app,{
      formidable : {
        uploadDir : __dirname + '/tmps/uploads'
      }
    });

opts
-----

- `coBody` 传递给co-body的选项，具体请参考 co-body包说明。
- `formidable` 传递给formidable,具体请参考 formidable 包说明。
- `qs` 传递给qs包的参数，请参考qs包说明。


  [1]: https://github.com/visionmedia/co-body
  [2]: https://github.com/felixge/node-formidable
  [3]: https://github.com/ljharb/qs