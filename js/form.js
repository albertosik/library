/**
* form.js v1.0
* 19.01.2021
* Albert Ohanesian
* classes for form generation and validation
*/
"use strict";
class Validator{
	notEmpty(value){
		return value.length>0?true:false;
	}
	template(value,template){		
		return value.search(template)==-1?false:true;
  }
  min(value,min){
    return value>=min?true:false;
  }
}

class Form {
  constructor(fields, data){    
    this.validator = new Validator();    
    this.fields = fields;
    this.defaults = 'defaults' in data?data.defaults:[];
    this.lists = 'lists' in data?data.lists:[];
  }  
  draw(target) {
    this.element = document.createElement("form");    
    this.element.innerHTML = `
      ${this.fields.map((field) => this[field.type](
        {
          name: field.name,
          type: field.type,
          title: field.title,
          value: this.defaults[field.name]?this.defaults[field.name]:field.value,
          options: 'values' in field?field.values:[]
        })).join("")}
      <div class="input"><button type="submit">Save</button><button type="reset" class="hide-modal">Close</button></div>
    `;    
    target.innerHTML = '';
    target.append(this.element);
  }
  text(params) {
    return this.input(params);
  }
  number(params) {
    return this.input(params);
  }
  input(params) {
    return `<div class="input">
            <label for="${params.name}">${params.title}</label>
            <input id="${params.name}" name="${params.name}" type="${params.type}" value="${params.value}">
            <span class="error error-${params.name}"></span>
            </div>`;
  }
  hidden(params) {
    return `
            <input id="${params.name}" name="${params.name}" type="hidden" value="${params.value}">
          `;
  }
  select(params) {
    return `<div class="input">
            <label for="${params.name}">${params.title}</label>
            <select id="${params.name}" name="${params.name}">
              ${this.lists[params.name].map( (option) => `<option value="${option._id}" ${option._id==params.value?'selected':''}>${option.title}</option>` ).join('')}
            </select>
            <span class="error error-${params.name}"></span>
            </div>`;
  }
  showErrors(){
    let errorDivs = document.querySelectorAll('.error');
    for(let div of errorDivs){
      div.innerHTML = '';
    }
    for(let error of this.errors){
      let div = document.querySelector('.error-'+error.field);
      div.innerHTML = error.message;
    }
  }
  validate(){    
    this.errors = []; 
    for(let field of this.fields){      
      if(field.name in this.element){
        for(let rule of field.rules){          
          if(!this.validator[rule.type](this.element[field.name].value,'value' in rule?rule.value:false)){
            this.errors.push({field:field.name,message:rule.message});            
            break;
          }
        }        
      }
    }
    if(this.errors.length == 0){
      return true;
    } else {
      this.showErrors();
      return false;
    }
  }
  getValues(){
    let values = {};    
    for(let field of this.fields){      
      if(field.name in this.element){
        values[field.name] = this.element[field.name].value;
      }
    }
    return values;
  }
}