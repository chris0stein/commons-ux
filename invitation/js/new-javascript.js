
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
