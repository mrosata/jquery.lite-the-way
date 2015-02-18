// Set up for the demo, example of how to start the actual plugin.
$('p').litetheway({
    document : '.demo-text',
    topMult  : 1.25,
    start    : 160,
    cutoff : true, // default will be false, to cutoff p tags if their bottom edge lands outside the lite margin
    end   : 260,
});