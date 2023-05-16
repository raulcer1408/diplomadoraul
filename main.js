const express=require('express');
const {Pool}=require('pg');
const { database } = require('pg/lib/defaults');

const app=express();
const port=3000;

const pool= new Pool({
    user:'postgres',
    host:'localhost',
    database:'MVC_DB',
    password:'root',
    port:'5432'
});
class Model{
    async getItems(){
        const {rows}=await pool.query('select * from items;');
        return rows;
    }
    async addItem(name){
        await pool.query("insert into items(name)values($1)",[name]);
    }
}
//VISTA
class View{
    render(data){
        let html='';
        for(let i=0; data.length;i++){
            html+=`<li>${data[i].name}</li>`;
        }
        return `<html>
        <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"></link>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js">
        </script>
        <title> items </title>
        </head>
        <body>
         <div class="container">
          <div class="row g-1">
           <div class="col-sm-4">
            <h1>ITEMS</h1>
             <ul class="list-group">${html}</ul>
             </br>
             </br>
          </div>
          </div>
          <form action="/add" method="post">
            <div class="row g-2">
             <div class="col-sm-4">
              <input type="text" name="name" placeholder="Enter item name" class="form-control" aria-label='
             </div>
            </div>
          </form>
         </div>
        </body>
        `
    }
}
//controlador
class Controller{
    constructor(model,view){
      this.model=model;
      this.view=view;
    }
    async getItems(req,res){
       const data=await this.model.getItems();
       const html=this.view.render(data);
       res.send(html);
    }
    async addItem(req,res){
      const name=req.body.name;
      const data=await this. model.addItem(name);
      res.send(data);
    }
}
//instanciacion
const model=new Model();
const view= new View();

const controller= new Controller(model,view); 
app.use(express.urlencoded({extended:true}));

app.get('/',controller.getItems.bind(controller));

app.post('/add',controller.addItem.bind(controller));

app.listen(port,() =>{
    console.log(`Este servidor se ejecuta en http://localhost:${port}`)
});