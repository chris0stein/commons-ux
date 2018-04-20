
//Michael's tab script
var tabsTab = document.querySelectorAll(".tabs-tab");
var formPart = document.querySelectorAll(".form-part");

[].forEach.call(tabsTab, function(tab, i, tabsTab) {
    tab.addEventListener('click', function() {
        [].forEach.call(tabsTab, function(tab, i) {
            if(tab !== this) {
                tab.classList.remove("tab-selected");
                formPart[i].classList.add("not-visible");
            } else {
                tab.classList.add("tab-selected");
                formPart[i].classList.remove("not-visible");
            }
        }, this);
    });
});


//Michael's tab script modified to work with cacap styling
// sorry, didn't have time to use the same code as tabs on portfolio pages.
var cacapTab = document.querySelectorAll(".cacap-tab");
var cacapPart = document.querySelectorAll(".cacap-part");

[].forEach.call(cacapTab, function(tab, i, cacapTab) {
    tab.addEventListener('click', function() {
        [].forEach.call(cacapTab, function(tab, i) {
            if(tab !== this) {
                tab.classList.remove("current-tab");
                cacapPart[i].classList.add("not-visible");
            } else {
                tab.classList.add("current-tab");
                cacapPart[i].classList.remove("not-visible");
            }
        }, this);
    });
});
