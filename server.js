const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
let fs = require('fs-extra')

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/scratch-file') {

    //----------------------------写入文件的代码-------------------------------------------
    //把base64数据写入文件：https://cloud.tencent.com/developer/ask/61089
    let base64Data = req.body.fileData.replace("data:application/x.scratch.sb3;base64,", "");
    let binaryData = new Buffer.from(base64Data, 'base64').toString('binary');

    let fileFullPath = 'sb3Files/';
    
    //TODO:如果该同学已经提交过这一课，那么应该覆盖还是新建一个文件？
    //保存的文件路径：年级/班级/课题/学生
    fileFullPath += req.body.gradeNum + '/'
                  + req.body.classNum + '/'
                  + req.body.courseNum + '/' 
                  + req.body.studentNum + '.sb3';
    /* 没有使用req.body.fileName（Scratch3文件名框中输入的文件名）因为可以是汉字等不易于保存的字符
    后期可以用于向数据库中保存文件信息。 */

    fs.outputFile(fileFullPath, binaryData, 'binary', err=>{
        if(err){
            console.log(err);
        }
        console.log('TODO:写入文件后测试写入是否成功，并向前端返回结果');
    })
    //----------------------------写入文件的代码完了-------------------------------------------

    //不需要把base64文件数据存入数据库，所以删除掉这一项
    delete req.body.fileData;
    //req.body.fileData = null;
    req.body.fileFullPath = fileFullPath;
  }
  if (req.method === 'GET') {
    
   // req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router 

  next()
})

// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})