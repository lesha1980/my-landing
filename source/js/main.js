(function(){
 
    var openFormButton = document.querySelector('.arrow__down');

    console.log(openFormButton);

    if(openFormButton){
        openFormButton.addEventListener('click', function(){
            form.open();
        })
    }

}());