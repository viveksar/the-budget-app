//the budget controller
var budgetController=(function(){
 
    var Expense=function(id,description,value){
        this.value=value;
        this.id=id;
        this.description=description;
        this.percentage=-1;
    }

    Expense.prototype.calcpercentage=function(totalIncome){
        if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }
    };
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    };

var Income=function(id,description,value){
    this.value=value;
    this.id=id;
    this.description=description;
}
var calculateTotal=function(type){
var sum=0;
data.allitems[type].forEach(function(curr){
    sum=sum+curr.value;
});
data.totals[type]=sum;
};

var data={
    allitems:{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1
}
return{
    addItem:function(type,des,val){
    var ID,newitem;
    
       // [1,2,3,4,5,] next id=6
        //[1,2,4,6,8] next id=9
       //ID=lastID+1

        //to creat new id
        if(data.allitems[type].length>0){
        ID=data.allitems[type][data.allitems[type].length-1].id+1;
        }
        else{
            ID=0;
        }



// creat new items based on type 'exp'or'inc'
    if(type==='inc'){
        newitem=new Income(ID,des,val);
    }
    else if(type==='exp'){
        newitem=new Expense(ID,des,val);
    }

    //push it into our data strecture
    data.allitems[type].push(newitem);
    //to return the new items
    return newitem;
},
//function to delete the item
deleteitem:function(type,id){
    var ids,index;
// let id=4
//data.allitems[type][id] is not correct because it will give the index to be 4 not the id
//let [1,2,4,6,7] be the id 
//so id=4 has index=2

 ids=data.allitems[type].map(function(current){
return current.id;
   
});
index=ids.indexOf(id);
if(index!==-1){
    data.allitems[type].splice(index,1);
}
},

calculateBudget:function(){
//calculate total income and expenses
calculateTotal('exp');
calculateTotal('inc');

//calculate budget :income-expenses
data.budget=data.totals.inc-data.totals.exp;

//to calculate the percentage of income that we spend
if(data.totals.inc>0){
data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);}
else{
    data.percentage=-1;
}
},
calculatePercentage:function(){
//to calculate the percentage of each of the expence taken from data.allitems.exp
data.allitems.exp.forEach(function(curr){ 
//to call the calculate percentage method for each expense
    curr.calcpercentage(data.totals.inc);
});
},

getPercentages:function(){
    var allper=data.allitems.exp.map(function(curr){
return curr.getPercentage();
    });
    return allper;
},

getTotal:function(){
    return{
        budget:data.budget,
        totalexp:data.totals.exp,
        totalinc:data.totals.inc,
        percentage:data.percentage
    };
},


testing:function(){
    console.log(data);
}
}
   
})();

//UI controller
var UIcontroller=(function(){
   var domstring={
       inputtype:'.add__type',
       inputdescription: '.add__description' ,
       inputvalue:'.add__value',
       inputaddbutton:'.add__btn',
       incomecontainer:'.income__list',
       expensescontainer:'.expenses__list',
       budgetLable:'.budget__value',
       incomeLable:'.budget__income--value',
       expensesLable:'.budget__expenses--value',
       percentageLable:'.budget__expenses--percentage',
       container:'.container',
       expensePerLable:'.item__percentage',
       dateLable:'.budget__title--month'
   }

 var formatNumber=function(num,type){
    var numSplit,int,dec,type;
/*1. + and - before the income and expense
 2. to round off in two decimal points
 3.to seprate the thousand with comma*/
num=Math.abs(num);
num=num.toFixed(2);
//to split into the decimal part and integer part
numSplit=num.split('.');
int=numSplit[0];
if(int.length>3){
    int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
}
dec=numSplit[1];
return (type==='exp'?'-':'+')   +' '+int +'.'  +   dec;
};
var nodeListforEach=function(list,callback){
    for(var i=0;i<list.length;i++){
        callback(list[i],i);
    }
    };

   return {
       getInput:function(){
           return{
            type:document.querySelector(domstring.inputtype).value,
            description:document.querySelector(domstring.inputdescription).value,
            //parseFloat is used to convert the number string into the number value
            value:parseFloat(document.querySelector(domstring.inputvalue).value)     
       };
   },
addlistitem:function(obj,type){
    var html,element;
    //1.to creat html string with place holder text
if(type==='inc'){
element=domstring.incomecontainer;

html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
}else if(type=='exp'){
element=domstring.expensescontainer;

  html=  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
 }
    //2.to replace placeholder text with some actual data
    newhtml=html.replace('%id%',obj.id);
    newhtml=newhtml.replace('%description%',obj.description);
    newhtml=newhtml.replace('%value%',formatNumber( obj.value,type));

    //3.to insert the html into the DOM
document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
},



// to deleate the elements from the user interface
deletelistitem:function(selectorid){
var el=document.getElementById(selectorid);
//we have to seelect the parent node first and then remove the child node
el.parentNode.removeChild(el);
},



//to clear the fields in the usser interface
clearField:function(){
    var fields,fieldArr;
    fields=document.querySelectorAll(domstring.inputdescription+','+domstring.inputvalue);
   fieldArr= Array.prototype.slice.call(fields);
   fieldArr.forEach(function(current,index,arr){
       current.value="";
   });
   fieldArr[0].focus();
},
//to display the budget in the user interface.
displaybudget:function(obj){
    var type;
    obj.budget>0?type='inc':type='exp';
    document.querySelector(domstring.budgetLable).textContent=formatNumber( obj.budget,type);
    document.querySelector(domstring.expensesLable).textContent=formatNumber(obj.totalexp,'exp');
    document.querySelector(domstring.incomeLable).textContent=formatNumber(obj.totalinc,'inc');
    if(obj.percentage>0){
        document.querySelector(domstring.percentageLable).textContent=obj.percentage+'%';
    }
    else{
        document.querySelector(domstring.percentageLable).textContent='.....';
    }
    
},
// to dispaly the budget percentage in the user interface
displayPercentage:function(percentages){
var field=document.querySelectorAll(domstring.expensePerLable);



nodeListforEach(field,function(current,index){
    if(percentages[index]>0){
current.textContent=percentages[index]+'%';}
else{
    current.textContent='---';
}
});
},
displayMonth:function(){
    var now,year,month,months;
    now=new Date();
    months=['january','february','march','april','may','june','july','aug','sep','oct','nov','dec'];
    year=now.getFullYear();
    month=now.getMonth();
    
    document.querySelector(domstring.dateLable).textContent=months[month]+" "+ year;

},
changetype:function(){
var fields=document.querySelectorAll(domstring.inputtype+','+domstring.inputdescription+','+domstring.inputvalue);
nodeListforEach(fields,function(cur){
cur.classList.toggle('red-focus');
});
document.querySelector(domstring.inputaddbutton).classList.toggle('red-focus');
},
   getdomstrings:function(){
       return domstring;
   }
};
   
   
    //wrrite code
})();

// the global controller
var controller=(function(budgetCtrl,UICtrl){


var setupeventlisteners=function(){

    
//to get the domstring from UIcontroller
var dom=UICtrl.getdomstrings();
    document.querySelector(dom.inputaddbutton).addEventListener('click',ctrlAdditem);
    //to reset bill after the enter is pressed
document.addEventListener('keypress',function(event){
    if(event.keyCode===13||event.which===13){
     
ctrlAdditem();

    }
});

document.querySelector(dom.container).addEventListener('click',ctrlDeleteitem);
document.querySelector(dom.inputtype).addEventListener('change',UICtrl.changetype);
}
 var updateBudget=function(){
     
    //1.to calculate the budget
    
    budgetCtrl.calculateBudget();
    //2. to return the budget
   var budget= budgetCtrl.getTotal();
    //3. to display the calculated budget in the user interface 
    UICtrl.displaybudget(budget);
} 


//to update the percentage of every expences
var updatepercentage=function(){
//1.calculate the percentage 
budgetCtrl.calculatePercentage();

//2.to read  percentage from the budget controller
var percentages=budgetCtrl.getPercentages();

//3.to update the user interface with the new percentage

UICtrl.displayPercentage(percentages);

};


var ctrlAdditem=function(){
    var input,newitem;
    //1.to get filled the value of amount
  input=UICtrl.getInput();
   

if(input.description!==""&&input.value>0&&!isNaN(input.value)){
    //2.add the amount to the budget controller
    
 newitem=budgetCtrl.addItem(input.type,input.description,input.value);

    //3. to add amount to the user interface
    UICtrl.addlistitem(newitem,input.type);

    //4. to clear the field 
    UICtrl.clearField();

    //5. calculate and update the budget
    updateBudget();

    //6. calcculate and update the percentage
    updatepercentage();
    }}


    //to delete the item when it is deleated from the user interface 
    var ctrlDeleteitem=function(event){
        var itemid,splitid,type,id;
        itemid=event.target.parentNode.parentNode.parentNode.parentNode.id;
     if(itemid){
         splitid=itemid.split('-');
        type=splitid[0];
         id=parseInt(splitid[1]);
       
        //1.to deleate the item from data strecture
        budgetCtrl.deleteitem(type,id);
        //2. to delete the item from user interface
        UICtrl.deletelistitem(itemid);
        //3.to update the budget
        updateBudget();
        //4.to calculate and update the percentage
        updatepercentage();
     }
    };
//to reset bill after the button is pressed

return{
    init:function(){
        console.log('application is running');
       
        UICtrl.displayMonth();  
// to set all the values to zero initially
UICtrl.displaybudget({
    budget:0,
    totalexp:0,
    totalinc:0,
    percentage:-1
});
setupeventlisteners();
    }
}
})(budgetController,UIcontroller);

controller.init();