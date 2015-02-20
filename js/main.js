// Set up for the demo, example of how to start the actual plugin.
$('*').litetheway({
    context  : '.demo-text',
    topMult  : 1.5,
    cutoff   : true, // default will be false, to cutoff p tags if their bottom edge lands outside the lite margin
    start    : 240,
    end      : 80,
});


$('#testMarginBtn').click(function (e) {
    e.preventDefault();
    $('#testMeasure1, #testMeasure2').toggleClass('hidden');
});