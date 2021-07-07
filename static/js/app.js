//Variables
var dropdown = d3.select("#selDataset");
var metaDataID = d3.select("#sample-metadata");
var dropChoice = d3.select(this).property("value");
var names = "";
var metadata = "";
var samples = "";
var otuID = "";
var otuLabels = "";
var sampleValues = "";
var transValue = "";

// Read data
d3.json("././data/samples.json").then((data) => {
    console.log("Object:", data);

    //Names
    names = data.names;
    console.log("Names:", names);

    DropDown(names);

    //Metadata
    metadata = data.metadata;
    console.log("Metadata:", metadata);

    //Samples
    samples = data.samples;
    console.log("Samples:", samples);

    Bar();
    Bubble();

}).catch((error) => {
    console.log("Error:", error);
});

//Dropdown function
function DropDown(listArray) {
    dropdown.append("option").text();
    for (var i = 0; i < listArray.length; i++){
        listArray.forEach(item => {
            dropdown.append("option").text(item);
    })};
}

//Desc array function
function Desc(numArray) {
    var descendingArray = numArray.sort((firstNum, secondNum) => secondNum - firstNum );
    console.log(descendingArray);
    return descendingArray;
}

//Bar plot
function Bar() {

    var trace1 = {
        x: sampleValues,
        y: otuID[0,10],
        orientation: "h",
        type: "bar",
        text: otuLabels,
        transforms: [{
            type: 'sort',
            target: 'x',
            order: 'ascending',
        },
        {
            type: 'filter',
            target: 'x',
            operation: '>=',
            value: transValue
        }
        ]
    };

    var data = [trace1];

    var layout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: {
            title: "Sample Values",
            zeroline: false,       
        },
        yaxis: {
            title: "OTU ID",
            zeroline: false,
        },
        hoverinfo: "text"
    };
    
    Plotly.newPlot("bar", data, layout);
}

// Bubble chart
function Bubble() {
    var trace1 = {
        x: otuID,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuID,
        },
        type: 'scatter'
    };
    
    var data = [trace1];
    
    var layout = {
        title: "Bacteria Cultures Found",
        xaxis: {
            title: "OTU ID",
            zeroline: false,        
        },
        yaxis: {
            title: "Sample Values",
            zeroline: false,
        },
        hoverinfo: "text"
    };
    
    Plotly.newPlot('bubble', data, layout);
}

//Event listener
dropdown.on("change", optionChanged);

function optionChanged() {

    dropChoice = d3.select(this).property("value");
    console.log("This is:", this);
    console.log("Selected Dropdown Value:", dropChoice);

    var selID = samples.filter(item => item.id === dropChoice);
    console.log("selID:", selID);
    
    Object.entries(selID[0]).forEach(([key, value]) => {
        if(key === "otu_ids") {
            console.log("otuID:", value);
            otuID = value};
        if(key === "otu_labels") {
            console.log("otuLabels:", value);
            otuLabels = value};
        if(key === "sample_values") {
            console.log("sampleValues:", value);
            sampleValues = value};
    });
    
    //Metadata display
    var dropChoiceNo = +dropChoice
    metaDataID.selectAll("div").text("");
    var metaID = metadata.filter(item => item.id === dropChoiceNo);
    console.log("metaID:", metaID);

    Object.entries(metaID[0]).forEach(([key, value]) => {
        metaDataID.append("div").text(`${key}: ${value}`);
    });

    //Top ten sample values
    var topTen = Desc(sampleValues).slice(0, 10);
    console.log("Top 10 Sample Values:", topTen);
    var topTenValue = topTen.slice(9);
    console.log("Value 10 List:", topTenValue);
    transValue = topTenValue[0];
    console.log("Value 10:", transValue);

    Bar();
    Bubble();
};


