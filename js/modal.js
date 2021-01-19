;
"use strict";
class Modal{
  constructor(){
    this.showButtons = document.querySelectorAll('.show-modal');    
    this.init();
  }
  init(){ 
    for(let i=0; i<this.showButtons.length; i++){
      this.showButtons[i].addEventListener('click',this._show.bind(this));
    }
  }  
  _show(e){    
    this.show('#'+e.target.dataset.target);
  } 
  _hide(e){
    if(e.target.classList.contains('hide-modal')){
      this.hide();
    }
  } 
  show(target){    
    this.modal = document.querySelector(target);        
    this.modal.style.cssText = `
      display: block;
      position: absolute;
      z-index: 2;
      left: ${document.body.clientWidth/2-300}px;
      top: 50px;
    `;
    this.modalWrap = document.createElement('div');
    this.modalWrap.className = 'modal-wrap';        
    document.body.append(this.modalWrap);
    this.modal.addEventListener('click',this._hide.bind(this));
  }  
  hide(){    
    this.modal.style.display = 'none';
    this.modalWrap.remove();
  }
};
