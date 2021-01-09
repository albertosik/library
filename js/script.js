const config = { storage: "local" };

class LocalStorage {
  select(entity, options = {}) {
    let result = JSON.parse(localStorage.getItem(entity));
    if('sort' in options){
      result.data.sort( (a,b) => a[options.sort] > b[options.sort]?1:-1);
    }            
    if('search' in options){
      result.data = result.data.filter(function(row){        
        for(let field of options.fields){
          if(row[field].toLowerCase().includes(options.search.toLowerCase())){            
            return true;
          }
        }
        return false;
      });
    }    
    if('conditions' in options){
      result.data = result.data.filter(function(row){                
        for(let condition of options.conditions){
          if(condition.action == '=' && row[condition.key] != condition.value){            
            return false;
          } else if(condition.action == '>' && row[condition.key] <= condition.value){            
            return false;
          }
        }
        return true;
      });
    }   
    return result || {data:[]};
  }
  insert(entity, properties) { 
    let result = this.select(entity);
    if(result.data.length == 0){
      result.autoInc = 1;
      properties._id = result.autoInc;
      result.data = [];
      result.data.push(properties);
      localStorage.setItem(entity,JSON.stringify(result));
    } else {
      result.autoInc++;
      properties._id = result.autoInc;
      result.data.push(properties);
      localStorage.setItem(entity,JSON.stringify(result));
    }
  }
  update(entity, _id, properties){     
    let result = this.select(entity);
    let index = result.data.findIndex(item=>item._id==_id);    
    for(let i in properties){
      result.data[index][i] = properties[i];      
    }        
    localStorage.setItem(entity,JSON.stringify(result));
  }
  delete(entity,_id){
    let result = this.select(entity);
    let index = result.data.findIndex(item=>item._id==_id)
    result.data.splice(index,1);
    localStorage.setItem(entity,JSON.stringify(result));
  }
}

class Rows {
  constructor() {
    this.init();
  }
  init() {
    if (config.storage == "local") {
      this.storage = new LocalStorage();
    }
  }
  get(options) {
    return this.storage.select(this.name, options).data;
  }
  save(properties) {
    if(this._id){
      this.storage.update(this.name, this._id, properties);
    } else {
      this.storage.insert(this.name, properties);
    }    
  }
  delete(_id){
    this.storage.delete(this.name, _id);
  }
  list(field, options = {}){
    let rows = this.get(options);
    let result = [];
    for(let row of rows){      
      result.push({_id:row._id,title:row[field]});
    }
    return result;
  }
}

class Books extends Rows {
  constructor() {
    super();
    this.searchableFields = ['title','author','publishing'];
    this.name = "books";
    this.fields = [
      {
        name: "id",
        type: "number",
        title: "ID",
        value: "",
        rules: [
          { type: 'notEmpty', value: true, message: "Обязательное поле" },
          { type: 'template', value: /^\d+$/, message: "Допустимы только цифры" },
          { type: 'min', value: 1, message: "Значение должно быть больше 0" },
        ],
      },
      {
        name: "title",
        type: "text",
        title: "Title",
        value: "",
        rules: [{ type: 'notEmpty', value: true, message: "Обязательное поле" }],
      },
      {
        name: "author",
        type: "text",
        title: "Author",
        value: "",
        rules: [{ type: 'notEmpty', value: true, message: "Обязательное поле" }],
      },
      {
        name: "year",
        type: "number",
        title: "Year",
        value: 1990,
        rules: [
          { type: 'notEmpty', value: true, message: "Обязательное поле" },
          { type: 'template', value: /^\d{4}$/, message: "Год должен состоять из 4х цифр" },
        ],
      },
      {
        name: "publishing",
        type: "text",
        title: "Publishing house",
        value: "",
        rules: [{ type: 'notEmpty', value: true, message: "Обязательное поле" }],
      },
      {
        name: "pages",
        type: "number",
        title: "Pages",
        value: 1,
        rules: [
          { type: 'notEmpty', value: true, message: "Обязательное поле" },
          { type: 'template', value: /^\d+$/, message: "Допустимы только цифры" },
          { type: 'min', value: 1, message: "Значение должно быть больше 0" },
        ],
      },
      {
        name: "quantity",
        type: "number",
        title: "Quantity",
        value: 1,
        rules: [
          { type: 'notEmpty', value: true, message: "Обязательное поле" },
          { type: 'template', value: /^\d+$/, message: "Допустимы только цифры" },
          { type: 'min', value: 1, message: "Значение должно быть больше 0" },
        ],
      },
    ];
  }
}

class Visitors extends Rows {
  constructor() {
    super();
    this.searchableFields = ['name','phone'];
    this.name = "visitors";
    this.fields = [
      {
        name: "id",
        type: "number",
        title: "ID",
        value: "",
        rules: [
          { type: 'notEmpty', value: true, message: "Обязательное поле" },
          { type: 'template', value: /^\d+$/, message: "Допустимы только цифры" },
          { type: 'min', value: 1, message: "Значение должно быть больше 0" },
        ],
      },
      {
        name: "name",
        type: "text",
        title: "Name",
        value: "",
        rules: [{ type: 'notEmpty', value: true, message: "Обязательное поле" }],
      },
      {
        name: "phone",
        type: "text",
        title: "Phone",
        value: "",
        rules: [
          { type: 'notEmpty', value: true, message: "Обязательное поле" },
          { type: 'template', value: /^[\d\s-]+$/, message: "Допустимы только цифры, пробел и тире" },
        ],
      },
    ];
  }
}

class Cards extends Rows {
  constructor() {
    super();
    this.name = "cards";
    this.fields = [
      {
        name: "visitor_id",
        type: "select",
        title: "Visitor",
        value: 0,
        rules: [
          { type: 'min', value: 1, message: "Выберите посетителя" },
        ],
      },
      {
        name: "book_id",
        type: "select",
        title: "Book",
        value: 0,
        rules: [
          { type: 'min', value: 1, message: "Выберите книгу" },
        ],
      },
      {
        name: "borrow_date",
        type: "hidden",
        title: "",
        value: Date.now(),
        rules: [],
      },
      {
        name: "return_date",
        type: "hidden",
        title: "",
        value: 0,
        rules: [],
      }
    ];
  }
}

class Page {
  constructor() {        
    this.modalForm = document.querySelector(".form-wrap");
    this.modal = new Modal();
    this.lists = {};
    this.selectOptions = {};
  }
  drawTable(fields,data,target) {
    let html = `
      <table class="table">
      <tr>${fields.map(field => `<th>${field.title}</th>`).join('')}<th></th></tr>
      ${data.map((row) => `
      <tr>
          ${fields.map(field => `<td class="${field.type}">${row[field.name]}</td>`).join('')}
          <td>
            <button class="edit" data-id="${row._id}">Edit</button>
            <button class="delete" data-id="${row._id}">Delete</button>
          </td>
         </tr>
        `
      ).join('')}
    `;    
    target.innerHTML = html;    
  }
  sortInit(){
    this.sortButton = document.querySelector('.sort');
    this.sortButton.addEventListener('click',this.sort.bind(this));
  }  
  searchInit(){
    this.searchButton = document.querySelector('.search');
    this.searchButton.addEventListener('click',this.search.bind(this));
  }
  draw() {          
    this.showInTable();
    this.newButton.addEventListener('click',this.create.bind(this));
    this.tableWrap.addEventListener('click',this.edit.bind(this));
    
  }
  showInTable(options = {}){    
    this.rows = this.entity.get(options);
    this.drawTable(this.entity.fields,this.rows,this.tableWrap);
  }
  formOnSubmit(e) {
    e.preventDefault();
    if(this.form.validate()){
      this.entity.save(this.form.getValues());
      this.modal.hide();
    }    
    this.showInTable();
  }
  showForm(data = {}){    
    this.form = new Form(this.entity.fields,data);        
    this.form.draw(this.modalForm);
    this.form.element.addEventListener('submit',this.formOnSubmit.bind(this));     
  }
  create(){
    this.entity._id = false;
    this.showForm({lists:this.selectOptions});
  }
  edit(e){    
    if(e.target.classList.contains('edit')){
      this.modal.show('#form');
      this.entity._id = e.target.dataset.id;   
      let index = this.rows.findIndex(item=>item._id==this.entity._id)    
      this.showForm({defaults:this.rows[index],lists:this.selectOptions});
    }
    if(e.target.classList.contains('delete')){       
      this.entity.delete(e.target.dataset.id);
      this.showInTable();
    }
  }
  sort(){
    let sortBy = document.querySelector('#sort');
    this.showInTable({sort:sortBy.value});
  }
  search(){
    let searchBy = document.querySelector('#search');
    this.showInTable({search:searchBy.value,fields:this.entity.searchableFields});
  }
}

class BooksPage extends Page {
  constructor() {
    super();    
    this.tableWrap = document.querySelector('.table-wrap');
    this.newButton = document.querySelector('.new');   
    this.sortInit();     
    this.searchInit();  
    this.entity = new Books();          
  }
}

class VisitorsPage extends Page {
  constructor() {
    super();
    this.tableWrap = document.querySelector('.table-wrap');
    this.newButton = document.querySelector('.new');   
    this.sortInit();     
    this.searchInit();  
    this.entity = new Visitors();  
  }
}

class CardsPage extends Page {
  constructor() {
    super();
    this.tableWrap = document.querySelector('.table-wrap');
    this.newButton = document.querySelector('.new');   
    this.sortInit();         
    this.entity = new Cards();  
    this.lists = {
      visitor_id: [],
      book_id: []
    };
    this.init();
  }
  init()
  {
    this.visitors = new Visitors();    
    this.lists.visitor_id = this.visitors.list('name');
    this.selectOptions.visitor_id = this.visitors.list('name');
    this.books = new Books();
    this.lists.book_id = this.books.list('title');
    this.selectOptions.book_id = this.books.list('title',{conditions:[{key:'quantity',action:'>',value:0}]});
    this.tableWrap.addEventListener('click',this.return.bind(this));   
  }
  formOnSubmit(e) {
    e.preventDefault();
    if(this.form.validate()){
      let formValues = this.form.getValues();
      let book = this.books.get({conditions:[{key:'_id',action:'=',value:formValues.book_id}]});
      if(book.length == 1 && book[0].quantity > 0){              
        this.entity.save(formValues);
        this.books._id = formValues.book_id;
        this.books.save({quantity:parseInt(book[0].quantity)-1});
        this.selectOptions.book_id = this.books.list('title',{conditions:[{key:'quantity',action:'>',value:0}]});
      }
      this.modal.hide();
    }    
    this.showInTable();
  }
  return(e)
  {
    if(e.target.classList.contains('return')){    
      let book = this.books.get({conditions:[{key:'_id',action:'=',value:e.target.dataset.bookId}]});
      if(book.length == 1){
        this.entity._id = e.target.dataset.id;
        this.entity.save({return_date:Date.now()});        
        this.books._id = e.target.dataset.bookId;
        this.books.save({quantity:parseInt(book[0].quantity)+1});
        this.selectOptions.book_id = this.books.list('title',{conditions:[{key:'quantity',action:'>',value:0}]});
      }
      this.showInTable();
    }
  }
  drawCell(field,row)
  {
    if(field.type=='select'){
      let index = this.lists[field.name].findIndex(item => item._id==row[field.name]);        
      return this.lists[field.name][index].title;
    } else if(field.name == 'borrow_date' || (field.name == 'return_date' && row[field.name] > 0)){      
      let date = new Date(parseInt(row[field.name])).toDateString();      
      return date;
    } else if(field.name == 'return_date'){
      return `<button data-id="${row._id}" data-book-id="${row.book_id}" class="return">Return</button>`;
    }
  }
  drawTable(fields,data,target) {   
    let html = `
      <table class="table">
      <tr>${fields.map(field => `<th>${field.title}</th>`).join('')}</tr>
      ${data.map((row) => `
      <tr>
          ${fields.map(field => `
            <td class="${field.type}">${this.drawCell(field,row)}</td>
          `).join('')}
         </tr>
        `
      ).join('')}
    `;    
    target.innerHTML = html;    
  }

}

class StatPage {
  constructor() {
    this.visitorsWrap = document.querySelector(".visitors");
    this.booksWrap = document.querySelector(".books");
    this.books = new Books();
    this.visitors = new Visitors();
    this.cards = new Cards();
    this.lists = {};
    this.rows = {};
    this.count = {};
    this.init();
  }
  init()
  {
    this.lists.visitor_id = this.visitors.list('name');
    this.lists.book_id = this.books.list('title');
    this.rows.cards = this.cards.get();
    this.count.visitor_id = [];
    this.count.book_id = [];
    this.countBooksAndVisitors();
  }
  countBooksAndVisitors()
  {
    for(let i=0;i<this.rows.cards.length;i++){
      let index = this.count.visitor_id.findIndex(item => item.visitor_id==this.rows.cards[i].visitor_id);
      if(index != -1){
        this.count.visitor_id[index].count ++;
      } else {
        this.count.visitor_id.push({visitor_id:this.rows.cards[i].visitor_id,count:1});
      }

      index = this.count.book_id.findIndex(item => item.book_id==this.rows.cards[i].book_id);
      if(index != -1){
        this.count.book_id[index].count ++;
      } else {
        this.count.book_id.push({book_id:this.rows.cards[i].book_id,count:1});
      }
    }   
    this.count.book_id.sort( (a,b) => b.count-a.count );
    this.count.visitor_id.sort( (a,b) => b.count-a.count );
  }
  getTableHtml(field)
  {
    let html = '';
    for(let i=0;i<this.count[field].length;i++){
      if(i>4){
        break;
      }
      let index = this.lists[field].findIndex(item => item._id==this.count[field][i][field]);              
      html += `<tr><td>${this.lists[field][index].title}</td></tr>`
    }
    return html;
  }
  draw() {
    let visitiorsTable = document.createElement('table');
    let booksTable = document.createElement('table');
    visitiorsTable.innerHTML = this.getTableHtml('visitor_id');
    booksTable.innerHTML = this.getTableHtml('book_id');
    this.visitorsWrap.append(visitiorsTable);
    this.booksWrap.append(booksTable);
  }
}

class App {
  constructor() {
    this.menu = [
      { name: "index", title: "Books" },
      { name: "visitors", title: "Visitors" },
      { name: "cards", title: "Cards" },
      { name: "stat", title: "Statistic" },
    ];
    this.nav = document.querySelector(".nav");
    this.init();
  }
  init() {
    this.drawPage(document.location.href);
  }
  drawMenu() {
    let html = this.menu
      .map((page) => `<a href="${page.name}.html">${page.title}</a>`)
      .join("");
    this.nav.innerHTML = html;
  }
  drawPage(href) {
    if (/index.html/.test(href)) {
      this.page = new BooksPage();
    } else if (/visitors.html/.test(href)) {
      this.page = new VisitorsPage();
    } else if (/cards.html/.test(href)) {
      this.page = new CardsPage();
    } else if (/stat.html/.test(href)) {
      this.page = new StatPage();
    }
    this.drawMenu();
    this.page.draw();
  }
}

new App();
