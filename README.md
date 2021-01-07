# 学生成绩管理

## Tech stack
Bootstrap, node, express, mongodb/local json database

## lowdb - local json database
https://www.mdeditor.tw/pl/2jcX
https://github.com/typicode/lowdb

## node.js mongodb query


(```)
    var MongoClient = require('mongodb').MongoClient;
    const { find } = require('./student')
    var url = "mongodb://localhost:27017/";
    router.get(`/student/:number`, function(req, res){
        Student.find(function(err, studentNumber){
            if(err){
                return res.status(500).send('Server error.')
            }
            let r = [];
            studentNumber = req.params.number;
            console.log(studentNumber);
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("itcast");
                var query = { number: studentNumber };
                dbo.collection("students").find(query).toArray(function(err, result) {
                    if (err) throw err;
                    result.forEach(function(obj){
                        let c = {};
                        for (var key in obj) {
                            c[key] = obj[key];
                        }
                        r.push(c);
                    })
                    console.log(r);
                    res.render('self.html',{
                        students:r
                    })
                });
            });
        })
    })
(```)

## tips while coding
- to copy an array in javascript, be aware of the shallow copy and deep copy
   - https://www.cnblogs.com/johnblogs/p/7218344.html
