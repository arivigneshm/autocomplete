let AutoComplete = (function(){
  let _dropdownData = [];
  let filteredArray = [];

  //key up codes

  let ONENTER = 13;
  let DOWN_ARROW = 40;
  let UP_ARROW = 38;

  // class names

  let HOVER_CLASS = 'hover-class';

  let _isSearchModified = false;

  function _init(data){
    _dropdownData = data;
    filteredArray = data;
    populateDropDown(_dropdownData);
    bindEvents();
  }

  function populateDropDown(data, searchValue){
    let html = '';
    for(let i=0; i<data.length; i++){
      html += dropDownHtml( data[i], searchValue, i);
    }
    if(!data.length){
      html = `<div class="highlight noresult flexM fdirection">
                <div class="flexM no-res-img-wrap">
                  <img class="wh100" src="../assets/noresult.png" />
                </div>
                <div>
                  No results found
                </div>
              </div>`;
    }
    getElem('result').innerHTML = html ;
  }

  function bindEvents(){
    var input = getElem('search');
    var result = getElem('result');
    input.addEventListener('input', searchVal);
    input.addEventListener('keyup', arrowEvents);
    result.addEventListener('click', selectField);
    result.addEventListener('mouseover', hoverFunction);
  }

  function searchVal(e){
    _isSearchModified = true;
    getElem('result').scrollTop = 0;
    var searchVal = e.target.value.trim().toLowerCase();
    var filteredDropDown = filterArray(searchVal);
    populateDropDown(filteredDropDown, searchVal);
  }

  function selectField(e){
    getAlertName(e.target.closest('.user-wrap'));
  }

  function hoverFunction(e){
    var elem = e.target.closest('.user-wrap');
    if(elem){
      removeClass( getElem('result').querySelector('.hover-class'), HOVER_CLASS);
      addClass(elem, HOVER_CLASS);
    }
  }

  function getAlertName(elem){
    elem && alert(elem.getElementsByClassName('name')[0].innerText);
  }

  function arrowEvents(e){
    var resultElem = getElem('result');
    var oldElem = resultElem.querySelector('.hover-class');
    var oldIndex = parseInt(oldElem?.getAttribute('data-index') || -1);
    oldIndex = _isSearchModified ? -1 : oldIndex;
    _isSearchModified = false;
    var keyCode = e.keyCode;
    var arrayLength = filteredArray.length;

    if(keyCode === ONENTER){
      getAlertName(resultElem.querySelector('.hover-class'));
    }

    removeClass(oldElem, HOVER_CLASS)

    if (keyCode === DOWN_ARROW){

      if(oldIndex === arrayLength-1){
        resultElem.scrollTop = 0;
        addClass(resultElem.querySelector('[data-index="0"]'), HOVER_CLASS);
      }

      else if(oldIndex > 2){
        let scrollValue = (oldIndex - 2) * 60 + (oldIndex - 1);
        resultElem.scrollTop = scrollValue;
      }

      else if( oldIndex === -1){
        resultElem.scrollTop = 0
      }

      addClass(resultElem.querySelector('[data-index="'+(oldIndex+1)+'"]'), HOVER_CLASS)
    }

    else if( keyCode === UP_ARROW){

      if(oldIndex > 2){
        let scrollValue = (oldIndex - 3) * 60 + (oldIndex -1);
        resultElem.scrollTop = scrollValue;
      }

      else if( oldIndex === 0){
        let scrollValue = (arrayLength - 3) * 60 + (arrayLength);
        resultElem.scrollTop = scrollValue;
        addClass(resultElem.querySelector('[data-index="'+(arrayLength-1)+'"]'), HOVER_CLASS)
      }

      addClass(resultElem.querySelector('[data-index="'+(oldIndex-1)+'"]'), HOVER_CLASS);
    }
    
  }

  function addClass(elem, className){
    elem?.classList.add(className);
  }

  function removeClass(elem, className){
    elem?.classList.remove(className);
  }

  function getElem(id){
    return document.getElementById(id);
  }

  function filterArray(searchValue){
    filteredArray = [];
    var nameStartsWith = [];
    var nameContains = [];
    var descStartsWith = [];
    var descContains = [];
    for(let i=0; i<_dropdownData.length; i++){
      var data = _dropdownData[i];
      var {displayName, company, email, address} = data;
      if(startsWithCheck(displayName, searchValue) ){
        nameStartsWith.push(data);
      }
      else if(containsCheck(displayName, searchValue)){
        nameContains.push(data);
      }
      else if(startsWithCheck(company, searchValue) || startsWithCheck(email, searchValue) || startsWithCheck(address, searchValue)){
        descStartsWith.push(data);
      }
      else if(containsCheck(company, searchValue) || containsCheck(email, searchValue) || containsCheck(address, searchValue))
      {
        descContains.push(data);
      }
    }
    filteredArray = nameStartsWith.concat(nameContains, descStartsWith, descContains);
    return filteredArray;
  }

  function containsCheck(data, searchValue){
    return data.toLowerCase().includes(searchValue)
  };

  function startsWithCheck(data, searchValue){
    return data.toLowerCase().startsWith(searchValue);
  }

  function dropDownHtml(data, searchValue, index){
    
    var name = '';
    var desc = '';

    var {displayName, company, email, address} = data;

    if(searchValue){

      if(containsCheck(displayName, searchValue)){
        name = displayName;
      }

      if(containsCheck(company, searchValue)){
        desc = company
      }

      else if(containsCheck(email, searchValue)){
        desc = email
      }

      else if(containsCheck(data.address, searchValue)){
        desc = address
      }

    }

    return '<div data-index="'+index+'" class="user-wrap">'+
              '<div class="userimg">'+
                '<img src="../assets/user.png" alt="image">'+
              '</div>'+
              '<div class="user-desc">'+
                getName(name || displayName, searchValue)+
                getDESC(desc || company, searchValue)+
              '</div>'+
            '</div>';
  }

  function getName(name, searchValue){
    name = highlightWord(name, searchValue);
    return '<span class="name">'+name+'</span>';
  }

  function getDESC(desc, searchValue){
    desc = highlightWord(desc, searchValue);
    return '<p>'+desc+'</p>';
  }

  function highlightWord(string, searchValue){
    return string.toLowerCase().replace(searchValue, '<em class="highlight">'+searchValue+'</em>');
  }

  return {
    init : _init
  }
}());


