const express =require('express');
const { Pool }=require('pg');
const { database, password } = require('pg/lib/defaults');

const app= express();
const port=3000;

const pool= new Pool({
  user:'postgres',
  host:'localhost',
  database:'MVC_DB',
  password:'root',
  port:'5432'
});
//modelo
class Model{
  async getItems(){
    const { rows }=await pool.query('select * from items;');
    return rows;
  }
  async addItem(name){
    await pool.query('insert into items(name)values ($1)',[name]);
  }
}
//vista
class View{
   render(data){
    //console.log('view',data);
    let html='';
    for(let i=0; i<data.length;i++){
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
          <input type="text" name="name" placeholder="Enter item name" class="form-control" aria-label="Sizing example input">
         </div>
         <div class="col-sm-4">
          <button class="btn btn-primary type="submit">add item </button>
         </div>
        </div>
      </form>
     </div>
    </body>
    `;
   }
}
class Controller{
  constructor(model,view){
    this.model=model;
    this.view=view;
  }
  async getItems(req,res){
    const data=await this.model.getItems();
    //console.log('aqui', data);
    const html=this.view.render(data);
    res.send(html);
  }
  async addItem(req,res){
    const name=req.body.name;
    //console.log('el valor es',name);
    const data=await this.model.addItem(name);
    return true;
  }
}
//instanciacion
const model= new Model();
const view= new View();

const controller=new Controller(model,view);
//rutas

app.use(express.urlencoded({ extended:true}));

app.get('/',controller.getItems.bind(controller));

app.post('/add',controller.addItem.bind(controller));

app.listen(port,()=>{
  console.log(`Este servidor se ejecuta en https://localhost:${port}`);
});
