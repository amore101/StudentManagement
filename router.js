const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter1 = new FileSync('students.json')
const adapter2 = new FileSync('admins.json')
const Student = low(adapter1)
const Admin = low(adapter2)



// var fs=require('fs')

// var Student=require('./student')
// var Admin=require('./admin')

var express=require('express')

// var MongoClient = require('mongodb').MongoClient;
// const { find } = require('./student')
// var url = "mongodb://localhost:27017/";


//1、创建一个路由容器
var router=express.Router()

//2、把路由都挂载到router路由容器中
router.get('/',function(req,res){
	res.render('login.html')
})

router.post('/login',function(req,res){
	var Username=req.body.username
	var Password=req.body.password
	var Number=req.body.username
	if(Admin.get("admins").find({"username": Username}).value() === undefined) {
		if(Student.get("students").find({"number": Username}).value() === undefined){
			res.redirect('/')
		}
		else if(Student.get("students").find({"number": Username}).value().password == Password) {
			res.redirect(`/student/${Username}`)
		}
	}
	else if (Admin.get("admins").find({"username": Username}).value().password == Password) {
		res.redirect('/students')
	}
	
	

	// if(Admin.find(function(admin){return admin.username == Username && admin.password == Password})===null){
	// 	if(Student.find(function(student){return student.username == Username && student.password == Password})===null){
	// 		res.redirect('/')
	// 	}
	// 	else{
	// 		res.redirect(`/student/${Username}`)
	// 	}
	// }
	// else{
	// 	res.redirect('/students')
	// }
	// Admin.findOne({username:Username,password:Password}, function(err,admin1){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	if(admin1===null){
	// 		Student.findOne({number:Number,password:Password}, function(err,admin2){
	// 			if(err){
	// 				return res.status(500).send('Server error.')
	// 			}
	// 			if(admin2===null){
	// 				res.redirect('/')
	// 			}
	// 			else{
	// 				res.redirect(`/student/${Username}`)
	// 			}
	// 		})
	// 	}
	// 	else{
	// 		res.redirect('/students')
	// 	}
	// })
})

router.get('/register1',function(req,res){
	res.render('register1.html')
})
router.get('/register2',function(req,res){
	res.render('register2.html')
})

router.post('/register1',function(req,res){
	const newStudent = req.body
	Student.get("students").push({
		...newStudent
	})
	res.redirect('/')
})
router.post('/register2',function(req,res){
	const newAdmin = req.body
	Admin.get("admins").push({
		...newAdmin
	})
	res.redirect('/')
})

router.get(`/student/:number`, function(req, res){
	const studentNumber = req.params.number;
	let r = []
	const ss = Student.get("students").find({"number":studentNumber}).value();
	r[0] = ss
	res.render('self.html', {
		students: r
	})

	// Student.find(function(err, studentNumber){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	let r = [];
	// 	studentNumber = req.params.number;
	// 	console.log(studentNumber);
	// 	MongoClient.connect(url, function(err, db) {
	// 		if (err) throw err;
	// 		var dbo = db.db("itcast");
	// 		var query = { number: studentNumber };
	// 		dbo.collection("students").find(query).toArray(function(err, result) {
	// 			if (err) throw err;
	// 			result.forEach(function(obj){
	// 				let c = {};
	// 				for (var key in obj) {
	// 					c[key] = obj[key];
	// 				}
	// 				r.push(c);
	// 			})
	// 			console.log(r);
	// 			res.render('self.html',{
	// 				students:r
	// 			})
	// 		});
	// 	});
		
	// })
})

router.get('/students',function(req,res){	
	res.render('index.html', {
		students: Student.get("students").value()
	})
//   Student.find(function(err, students){
// 	if(err){
// 		return res.status(500).send('Server error.')
// 	}
// 	res.render('index.html',{
// 		students:student
// 	})
//   })
})

router.get('/students/new',function(req,res){
	res.render('new.html')
})

router.post('/students/new',function(req,res){
	Student.get("students").push(req.body).write()
	res.redirect('/students')

	// new Student(req.body).save(function(err){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	res.redirect('/students')
	// })
})

router.get(`/students/edit/:number`,function(req,res){
	const studentNumber = req.params.number;
	res.render('edit.html', {
		student: Student.get("students").find({"number": studentNumber}).value()
	})

	// Student.findById(req.query.id.replace(/"/g,""), function(err,student){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	res.render('edit.html',{
	// 		student:student
	// 	})
	// })
})

router.post(`/students/edit/:number`,function(req,res){
	const studentNumber = req.params.number;
	Student.get("students").remove({"number": studentNumber}).write()
	Student.get("students").push(req.body).write()
	res.redirect('/students')

	// var id=req.body.id.replace(/"/g,"")
	// Student.findByIdAndUpdate(id,req.body,function(err){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	res.redirect('/students')
	// })
})

router.get(`/students/delete/:number`,function(req,res){
	const studentNumber = req.params.number;
	Student.get("students").remove({"number": studentNumber}).write()
	res.redirect('/students')
	
	// var id=req.query.id.replace(/"/g,"")
	// Student.findByIdAndRemove(id,function(err){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	res.redirect('/students')
	// })
})

router.get('/students/search',function(req,res){
	res.render('search.html')
})

router.post('/students/search',function(req,res){
	const studentNumber=req.body.number
	const result = Student.get("students").find({"number":studentNumber}).value()
	res.render('search.result.html',{
		students:result
	})
	// Student.findOne({number:StudentNumber}, function(err,students){
	// 	if(err){
	// 		return res.status(500).send('Server error.')
	// 	}
	// 	res.render('search.result.html',{
	// 	students:students
	// 	})
	// 	// console.log(students)
	// })
})

module.exports=router

