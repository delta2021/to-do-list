const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
let toDoList = [];
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    const options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
    const day = new Date().toLocaleDateString('en-US', options);
    res.render('list', {day: day, toDoList: toDoList});
    }
)

app.post('/', (req, res) => { 
    toDoItem = req.body.toDoItem;
    toDoList.push(toDoItem);
    res.redirect('/');
})
app.listen(port, ()=>console.log('server started on port 3000'));