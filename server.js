const express = require('express');
const mongoose = require('mongoose');
const Employee = require('./models/employee');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const db = "mongodb+srv://admin:test1234@books.mojrn.mongodb.net/employee-manage?retryWrites=true&w=majority";
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
    console.log("Connected to database");
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
})

app.get('/', (req, res) => {
    Employee.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index', {title: 'Homepage', employee: result});
    })
    .catch((err) => {
        res.send(err);
    })
    
})

app.get('/add-employee', (req, res) => {
    res.render("upload", {title: "Add Employee"})
})

app.post('/upload', (req, res) => {
    const employee =new Employee({
        name: req.body.name,
        department: req.body.department,
        designation: req.body.designation,
        salary: req.body.salary
    });

    employee.save()
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {
        res.send(err);
    })
})

app.post('/update/:id', (req, res) => {
    id=req.params.id;
    Employee.findByIdAndUpdate(
        id,
        {
            name: req.body.updatedName,
            department: req.body.updatedDepartment,
            designation: req.body.updatedDesignation,
            salary: req.body.updatedSalary
        },
        function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.redirect('/');
            }
        }
    )


})

app.post('/delete/:id', (req, res) => {
    id=req.params.id;
    Employee.findByIdAndDelete(id)
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {
        res.send(err);
    })
})