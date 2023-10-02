// Source: https://www.jqueryscript.net/other/bootstrap-tabs-carousel.html
// This JS Code helps to create a "Back"-button. The trick is to create several tabs within one
// html page in which the participants can go back and forth as they want. Note that functions
// like before_next_page() are just triggered when exiting the very last tab of that html page!
// (See also the discussion at https://groups.google.com/g/otree/c/0UvDG8mhhcs)

function bootstrapTabControl() {
    var i, items = $('.nav-link'), pane = $('.tab-pane');

    // This creates the Next button:
    $('.nexttab').on('click', function() {
        for(i=0; i<items.length; i++) {
            if ($(items[i]).hasClass('active')==true) {
                break;
            }
        }
        if(i<items.length-1) {
            // for the tab:
            $(items[i]).removeClass('active');
            $(items[i+1]).addClass('active');
            // for the pane TODO: Can we delete this part?
            $(pane[i]).removeClass('show active');
            $(pane[i+1]).addClass('show active');
        }
    });

    // And this creates the Back button:
    $('.prevtab').on('click', function() {
        for (i=0; i<items.length; i++) {
            if ($(items[i]).hasClass('active')==true) {
                break;
            }
        }
        if(i!=0) {
            //for the tab:
            $(items[i]).removeClass('active');
            $(items[i-1]).addClass('active');

            //for the pane:
            $(pane[i]).removeClass('show active');
            $(pane[i-1]).addClass('show active');
        }
    });
}
bootstrapTabControl();

function topFunction() {
    document.body.scrollTop=0;
    document.documentElement.scrollTop=0;
}

// TODO: Here seems to be a more elegant way to produce "back"-buttons! Take a look at it
// https://s3.amazonaws.com/otreehub/browsable_source/1e38462b-46c7-4ca1-bca5-536462f90131/back_button/Instructions.html



