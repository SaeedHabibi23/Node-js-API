const express = require('express');
const {body , validationResult} = require('express-validator');
let users = require('./users');
const app = express();
app.use(express.json());

app.get('/' , (req,res)=>{
    res.send('hello express');
});


// app.get('/api/users' , (req,res)=>{
//     res.send([
//         {id: 1 , name: 'user1'},
//         {id: 2 , name: 'user2'},
//         {id: 3 , name: 'user3'},
//         {id: 4 , name: 'user4'},
//         {id: 5 , name: 'user5'}
//     ]);
// });


// app.get('/api/users/:id' , (req,res)=>{
//     // console.log(req.params);
//     res.send({
//         id: req.params.id , name: `user${req.params.id}`
//     });
// });


app.get('/api/users' , (req, res)=>{
    res.json({
        data: users,
        message: "OK"
    });
});


app.get('/api/users/:id' , (req, res)=>{
    const user = users.find((u) => u.id == req.params.id);
    if(!user){
        return res.status(404).json({
            data: null ,
            message: "Users Was not Found"
        })
    }
    else{

    
    res.json({
        data: user,
        message: "Ok"
    });
}
});


app.post("/api/userss", [
    body('email' , 'email must be valid').isEmail(),
    body('FirstName' , 'First name cant be empty').notEmpty(),
    body('LastName' , 'LastName cant be empty').notEmpty(),
], (req , res)=>{
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            data: null ,
            errors: errors.array() ,
            message: 'Validation Error'
        });
    }
    users.push({id: users.length + 1 , ...req.body});
    res.json({
        data:users ,
        message: "Ok" ,
    });
});




app.put("/api/userss/:id", [
    body('email' , 'email must be valid').isEmail(),
    body('FirstName' , 'First name cant be empty').notEmpty(),
    body('LastName' , 'LastName cant be empty').notEmpty(),
], (req , res)=>{
    const user =  users.find((u) => u.id == req.params.id);
    if(!user){
        return res.status(400).json({
            data: null , 
            message: 'The user not found' 
        });
    }
   users =  users.map(user=>{
        if(user.id == req.params.id){
            return { ...user , ...req.body}
        }
        return user;
    });
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            data: null ,
            errors: errors.array() ,
            message: 'Validation Error'
        });
    }
    res.json({
        data:users ,
        message: "Ok" ,
    });
});



app.delete('/api/userss/:id' , (req , res) =>{
    const user = users.find((u) => u.id == req.params.id);
    if(!user){
        return res.status(400).json({
            data: null , 
            message: 'users not found'
        });
    }
    const index = users.indexOf(user);
    users.splice(index , 1);
    res.json({
        data: users , 
        message: 'users was delete'
    });
});





app.listen(3000  , ()=> console.log("Listen to port 3000"));