"use strict";
/**
 * Peter James Bernante
 * CS472 - W3D2: Module and Closure Lab
 * 08 Aug 2017
 */

(function () {
    
    // Question 1
    var rudyTimer = (function () {
        var timer = null;  // stores ID of interval timer
        
        var rudy  = function () {   // called each time the timer goes off
            document.getElementById("output").innerHTML += " Rudy!";
        };
    
        return function () {
            if (!timer) {
                timer = setInterval(rudy, 1000);
            } else {
                clearInterval(timer);
                timer = null;
            }
        };
    })();
    
    
    // Question 2
    var accountFactory = (function () {
        
        var account = function (acctName, deposit) {
            var name = acctName,
                balance = deposit;
        
            return {
                getName: function () {
                    return name;
                },
                
                getBalance: function () {
                    return balance;
                }
            };
        };
        
        return {
            createNewAccount: function () {
                var name = document.getElementById("acctName").value,
                    deposit = document.getElementById("deposit").value;
                return account(name, deposit);
            }  
        };
    })();
    
    var btnCreateClick = (function () {
        var accountInfoList = [];
        
        return function () {
            accountInfoList.push(accountFactory.createNewAccount());
            
            var displayList = document.getElementById("acctList");
            
            displayList.value = accountInfoList.map(function (e) {
                return "Account name: " + e.getName() + 
                       " Balance: " + e.getBalance();
            }).join("\n");
        };
    })();
    
    window.onload = function () {
        document.getElementById("btnClickMe").onclick = rudyTimer;
        document.getElementById("btnCreateAccount").onclick = btnCreateClick;
    };
})();