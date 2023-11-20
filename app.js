//we are using module pattern it arrange our work when ever using it u must add (); at the end 
//budget controller
//the budget keep tract of the expense and income and also percentages
var budgetController = (function() {
//data for expense 
var Expenses = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
};
// for percentage calculation in the last page
Expenses.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {

        this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
        this.percentage = -1;
    }
 
};
Expenses.prototype.getPercentage = function() {
    return this.percentage;
};

//data for income
var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
};

//we calculate the expense and income here the type stands for either expenses or income
var calculateTotal = function(type) {
// we create a var for sum so the current vallue will be added to sum anytime we want to calculate income 
var sum = 0;
data.allItems[type].forEach(function(current) {
    sum = sum + current.value;
    //let me explain what i did i said sum is 0 so when ever we have a current value we add it to our sum 
    //the answer will now be our new sum value so when we have another current value we will add it to the new sum
});
  data.totals[type] = sum;
};
//we want to write all the income and expense out we put it in an harray and calculate it
// it called the data structure
  var data = {
    allItems: {
        exp: [],
        inc: []
    },
    //calculate total expense and income
   totals: {
    exp: 0,
    inc: 0
   },
   budget: 0,
   percentage: -1
  };

  //let me create a public method it will allow us to add new item either expense or income
  //if some call diz option to create a new item that means we have to know the type, description ,and value
  return {
    addItem: function(type, des, val) {
        var newItem, ID;
        //CREAte new Id
        if (data.allItems[type].lenght > 0) {
            ID = data.allItems[type][data.allItems[type].lenght -1].id + 1;
        } else {
            ID = 0;
        }
        
        //when we click for new item what it will ask first it either income or expenses let do that 
      if (type === 'exp') {
        newItem =  new Expenses(ID, des, val);
      } else if (type === 'inc') {
        newItem =  new Income(ID, des, val);
      }
     //now we want to select which of the harray we want to store data either exp or inc
     //let me explain,when we select the type either exp or inc dont forget the push method add item at the end of the harray
     data.allItems[type].push(newItem);
      return newItem;   

    },

    //create delete item function in the budget
    deleteItem: function(type, id) {
        var ids, index;
       
        ids = data.allItems[type].map(function(current) {
            
            return current.id; 
        });
    
        index = ids.indexOf(id);
        //  !== means difference
        if (index !== -1) {
            // splice is use to remove element
            data.allItems[type].splice(index, 1);

        }
    },
    //here we will calcute the budget
    calculateBudget: function() {
 //claculate total income and expenses
  calculateTotal('exp');
  calculateTotal('inc');
  //calculate budget:income and expenses
  data.budget = data.totals.inc - data.totals.exp;
  // we will calculate the percentage of income that was spend 
  // to get the percentage ?is dividing the expenses by the the income time 100
  // we are going to use math.round so it will give us specific answer and not point something something 
  // i added if because we want the calculation to happen only if we have an income
  //just imagine no income and you want to have expenses there should no be calculation
  if (data.totals.inc > 0) {
    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
  } else {
    data.percentage = -1;
  }
  
    },
    // how to add percentage beside the expenses at the last page
    calculatePercentages: function() {
 // i want to add percentage beside the expenses not on the budget board but down where it diplay when ever we add and delete
 
    // calculate percentages what we want to happen for each element the cur stands for current
  data.allItems.exp.forEach(function(cur) {
    cur.calcPercentage(data.totals.inc);
  });
 
    },


    // we need to get percentages
    getPercentages: function() {
        // we just dont want to loop on the harray alone and do something we want to store it somewhere that y we u Math
        var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
        });
       return allPerc;
       
    },

    getBudget: function() {
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        };
    }
  };
})();

//ui controller
var uiController = (function() {
    // All html element is being stored here and each element is called node 
    // does add type we might want to change the class name and we might have use it in diffrent place
    // we can save it here so if we change the name here it will chnage everwhere 
    var DOMstrings ={
        //i can change the class name from '.add__type' to DOMstrings.inputtype
        inputType: '.add__type',
        //i can change the class name from '.add__description' to DOMstrings.inputDescription
        inputDescription: '.add__description',
          //i can change the class name from '.add__value' to DOMstrings.inputValue
         inputValue: '.add__value',
          //i can change the class name from '.add__btn' to DOMstrings.btn we have made it public
          inputBtn: '.add__btn',
          //am going to create var dom for income list and expense list 
          incomeContainer: '.income__list',
          ExpensesContainer: '.expenses__list',
          budgetLabel: '.budget__value',
          incomeLabel: '.budget__income--value',
          expensesLabel: '.budget__expenses--value',
          percentageLabel: '.budget__expenses--percentage',
          //for deleting item
          container: '.container',
          expensesPercLabel: '.item__percentage',
          dateLabel: '.budget__title--month'
    };
      // i want when ever we have a value it should have eg 200.00 let point zero zero end it maybe 233.4567 it should be 233.46
    // when the number is thousand it should have a comer eg 2,000
    // when it income it should have a plus infront expenses it should have a minus in front
       var formatNumber = function(num, type) {
        //tofixed is used for the decimal number to make it two nuber after the point eg 2,000.00 .. 3,555.67
        var numSplit, int, dec, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        // now the comer saperating the thousand
        int = numSplit[0];
        // we will write if the number is more that 3 that a thousand
        // and minus 3 that where the comer will be because it might be 2000 minus 3 that where it will be or 20000 minus 3 also
        if (int.length > 3) {
     int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); 
        }
        dec = numSplit[1];
        // we want to put minus in front of expenses and pluse in front of income 
        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;
    };
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

 return {
    getInput: function() {
        return {
        type: document.querySelector(DOMstrings.inputType).value, //anytime we click it ,it will be income or expense
        description: document.querySelector(DOMstrings.inputDescription).value,//ehat the income or expense is all about
        //the value is strings and we cant calculate strings so we add parsefloat it turn strings to number 
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)//the amount of the income or expense
        };
    },

    //adding list of item
    addListItem: function(obj, type) {
        var html, newHtml, element;
        //create html strings with placeholder
        //we are going to put some actual data that will be there,income idpercentage,salary description value where amout is written
        if (type === 'inc') {
            element = DOMstrings.incomeContainer;
   html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">]<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      
        } else if (type === 'exp') { 
            element = DOMstrings.ExpensesContainer;
         html =   ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
        }
        //replace the placeholder with actual data
        //we are using brand new method we have not used before REPLACE method
   newHtml = html.replace('%id%', obj.id);
   newHtml = newHtml.replace('%description%', obj.description);
   newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
   //we have to insert htm into the dom
   document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


    },
    // we want to select things we want to delete
    deleteListItem: function(selectorID) {
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
    },

    //when ever we put our type description and value and it shows down it show always clear athoumatically
    clearFields: function() {
        //what are the things we want it to clear
        var fields, fieldsArr;
      fields =  document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      //we want the mouse to return to description when ever we input value
      fieldsArr[0].focus();
    },
    // i want when ever we calculate the budget it should always display we need object where all the data is store
    displayBudget: function(obj) {
 // here will consist all the data we want to save here
 // we want the plus to show infront of income in budget and minuse to show infront of expense in budget so we add  our formatnumber
 var type;
 obj.budget > 0? type = 'inc' : type = 'exp';
 document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
 document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
 document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

 // we want it to display percentage sign beside the percentage number
 if (obj.percentage > 0) {
    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
    
 } else {
    //if the percentage is minus something or less than zero want we it to display
    document.querySelector(DOMstrings.percentageLabel).textContent = '--';
    
 }

    },
    
    // we want the percentage to show beside the expenses in the last page so it will display
    displayPercentages: function(percentages) {
        // we dont know how many items we have so we use queryselectorall so it select all
        
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
    
        
        nodeListForEach(fields, function(current, index) {
            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '--';
            }
        });
     
    },
    
    // how to display the current month and year
    displayDate: function() {
  // so we want to get the current date
  var now, year, month, months;
  now = new Date();
  months = ['january', 'febuary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  month = now.getMonth();
  year = now.getFullYear();
  document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },
     // we want anytime we click type to expenses the color should change to red 
     changeType: function() {
        // we will type out things that will change color to red when we chose expenses
        var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);
        nodeListForEach(fields, function(cur) {
        // we want to add the red focus class on the current element 
        // instead of us using add and remove we going to use toggle toggle wen on expenses it red or income it goes diffiult itself
        cur.classList.toggle('red-focus');
        });
        // we want the input btn to be read when we are in expenses also
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

     },
  
    // Domstrings can only be used in the ui controller so we want to make it public so it can be use anywhere 
    //put comar in the last bracket
     getDOMstrings: function() {
        return DOMstrings;
     }
 };
})();

//global app controller
var controller = (function(budgetCtrl, uiCtrl){
     // now have made the domstring public so i want to call it here so it works here 
     var DOM = uiCtrl.getDOMstrings();
    //we have two eventlistener the btn and the enter we can put it in one function
    var setupEventlisteners = function(){
   //copy the two eventlistners there 
    //now  i can change the add__btn name and put it in dumstrings since it public now
    document.querySelector(DOM.inputBtn).addEventListener('click', function() {
        ctrlAdd();
    })

    //when ever we press the button enter i want it to do the same thing add_btn is doing 
    //enter as key code and it 13 if you check it in consolog
   document.addEventListener('keypress', function(event) {
    if(event.keyCode === 13 || Event.which === 13) {
        ctrlAdd();
    }
   });
   //we have a button when ever we want to delete an item 
   document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); 
    
  // we want anytime we click type to expenses the color should change to red 
  document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changeType);

    };

   
    //now we want to calculate the budget
    var updateBudget = function() {

        //calculate budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //displaying the budget on the ui
        //we are going to call the display budget
     uiCtrl.displayBudget(budget);
    };
       // i want to add percentage beside the expenses not on the budget board but down where it diplay when ever we add and delete
       var updatePercentages = function() {
        // calculate percentages
        budgetCtrl.calculatePercentages();
        //read percentages from the budget controler
        var percentages = budgetCtrl.getPercentages();
         
        //updating the ui with the new percentage beside the expense in the last page 
        uiCtrl.displayPercentages(percentages);
        
       };
   
    //anything that happens in btn same ass keypress so we create a function dont forget the law dont repeat yourself
    var ctrlAdd = function() { 
               var input, newItem;
  //get the field input data
  // so anytime we press the btn or enter it will work for value description and type
  var input = uiCtrl.getInput();
  //when ever there is no description or item we dont want it to open another tab when we click enter 
  //description must not be emtpy or value not a number and the value must be greater than 0 before it ould create tab

   if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
// all diz will happen if condition is being meet
   //add the item to the budget controller
  newItem = budgetCtrl.addItem(input.type,input.description,input.value);
  //anytime we input evrything we want it to always show in either income or expenses
 uiCtrl.addListItem(newItem, input.type);
 // we want to clear fields so we can write new ones 
 uiCtrl.clearFields();
 // after clearing the field i nwant it to calculate budget
 updateBudget();
  // calculate and update percentage beside the expenses
  updatePercentages();
   }
   


    };
    // we create a function for deleting item here 
    var ctrlDeleteItem = function(event) {
        // we are going to use targte so it will target what we want 
        // we are going to use parentNode it will be moving up in html if the class is the 4th class we will write it 4 times
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            // we are going to use the split it will split item
            splitID = itemID.split('-');
            type = splitID[0];
           ID = parseInt(splitID[1]);
            // delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // delete item from ui
            uiCtrl.deleteListItem(itemID);
            // update and show the the budget because the balance will change 
            updateBudget();
            // calculate and update percentage beside the expenses
           updatePercentages();
        }

    };
    //let create public initialization function to make everything run since we want it to be public we return it 
    return {
        init: function() {
            //we want all the value to go back to zero when ever we want to start the budget afresh
            uiCtrl.displayDate();
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            //let call setupeventlistener because that why i create it
            //it means our setupeventlisteners will only be setup when we call our init function
            setupEventlisteners();

        }
    }
   
})(budgetController, uiController);
//without diz code nothing will happen because there wont be eventlisteners
controller.init();