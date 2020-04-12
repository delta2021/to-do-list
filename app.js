const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const time = require('./time.js');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true,  useUnifiedTopology: true });
const itemsSchema = new mongoose.Schema({
    name: String
});
const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})
const Item = mongoose.model('item', itemsSchema);
const List = mongoose.model('list', listsSchema);
const item1 = new Item({
    name: '欢迎使用'
});
const item2 = new Item({
    name: '请在下方输入您的待办事项吧'
});
const item3 = new Item({
    name: '点击左侧复选框删除已完成的事项'
});



const defaultItems = [item1, item2, item3];

function errHandler(err, successMsg){
    if (err){
        console.log(err);
    } else if (successMsg){
        console.log(successMsg);
    }
}

app.get('/', (req, res) => {
    const day = time.getDay();
    let listName = "default";
    Item.find({}, function(err, list){
        res.render('list', {listTitle: day, toDoList: list, listName: listName});     
    })
}
)

app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName.toUpperCase();
    List.findOne({name: customListName}, function(err, list){
        if (list) {
            res.render('list', {listTitle: customListName, toDoList: list.items, listName: customListName});
        } else{
            list = new List({
                name: customListName,
                items: defaultItems
            })  
            list.save(); 
            res.redirect(`/${customListName}`);      
        
        }
    })
  
   
})


app.post('/', (req, res) => { 
    let item = req.body.item;
    let listName = req.body.list;
    const newItem = new Item({name: item});
    if (listName == "default"){
        newItem.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(newItem);
            foundList.save();
        })
        res.redirect(`/${listName}`);
    }
})

app.post('/delete', (req, res) => {
    let id = req.body.id;
    let listName = req.body.listName;
    if (listName == 'default'){
        Item.findByIdAndRemove(id, {useFindAndModify: false}, function(err){
            errHandler(err);
        });
        res.redirect('/');
    } else{
        // List.findOne({name: listName}, function(err, foundList){
        //     foundList.items = foundList.items.filter(item => item.id != id);
        //     foundList.save();
        // })
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, {useFindAndModify: false}, errHandler);
        res.redirect(`/${listName}`);
    }

})


app.listen(port, ()=>console.log('server started on port 3000'));