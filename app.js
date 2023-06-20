const express = require('express');
const {body , validationResult} = require('express-validator');
let users = require('./users');
const app = express();
const morgan = require('morgan');
const config = require('config');

// Use Helemet ............................................................
const helmet = require("helmet");
// ...........................................................
app.use(helmet());
app.use(express.urlencoded({extended: true}));
// برای پوست من استفاده میشود در بخش  url encoded که در خواست از این طریق ارسال مکینم

//  Static Middleware .................................................................

app.use(express.static('public'));
app.use(express.json());


console.log("Application Name:" , config.get("name"));
console.log("Application version:" , config.get("version"));
console.log("Application sms:" , config.get("SMS"));



// if(app.get('env') === 'development'){
//     console.log('morgan is active');
//     app.use(morgan('tiny'));
// }
// .......................use middleware her ...........................
//  next move control from one middleware to a nother middleware....................................
// app.use((req , res , next)=>{
//     console.log('midd 1');
//     next();
// });

// app.use((req , res , next)=>{
//     console.log('midd 2');
//     next();
// });

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

// app.use((req , res , next)=>{
//     console.log('midd 3');
//     next();
// });



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