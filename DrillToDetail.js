////////////////////////////////////////////////////
//Version: 	2.1
//Author:  	Willem Ahlers
//Usage:	Drill to detail extension scripts
//Date:		7 April 2016
////////////////////////////////////////////////////
define( [
        // Load the properties.js file using requireJS
        // Note: If you load .js files, omit the file extension, otherwhise
        // requireJS will not load it correctly 
		'jquery',
		'qlik',
        './properties/properties',
		'./properties/initialProperties',
		/***********************
		This is used to reference specific CSS V2.0 upwards.
		QlikSense set the CSS class qv-object-[extension name] on your visualizations 
		and your CSS rules should be prefixed with that.
		************************/
		'css!./DrillToDetail.css'  
		
    ],
	
    function ( $, qlik, props, initProps, styleSheet) {
        'use strict';	
		//Inject Stylesheet into header of current document
		$( '<style>' ).html(styleSheet).appendTo( 'head' );
        return {
			//Define the properties tab - these are defined in the properties.js file
             definition: props,
			
			//Define the data properties - how many rows and columns to load.
			 initialProperties: initProps,
			
			//Not sure if there are any other options available here.
			 snapshot: {cantTakeSnapshot: true
			 },

			//paint function creates the visualisation. - this one makes a very basic table with no selections etc.
            paint: function ( $element , layout ) {
				try {
					//Define current application
					var app = qlik.currApp();
					//Define the data matrix, to count the distinct values.
					var matrix = layout.qHyperCube.qDataPages[0].qMatrix;
					var fieldName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
					var noOfDistinctValues = layout.props.distinctValues;
					var selectedSheet = layout.props.selectedSheet;
					var buttonText = layout.props.ButtonText;
									
					//Check to see if we are not in edit mode and if autodrill is true
					if(qlik.navigation.getMode() != 'edit'  && layout.props.autoDrill == true) {
						
						//Using Autodrill, so only check the number of dimension rows to perform drill down or drill up behaviour.
						//DRILL DOWN - AUTO
						if(layout.props.DrillType == "down"){
							//Drill down has been selected, automatic jump to defined sheet, after dimension count is reached.

							if(matrix.length==noOfDistinctValues){

								qlik.navigation.gotoSheet(selectedSheet);
							}
							
						}
						//DRILL UP  - AUTO
						if(layout.props.DrillType == "up"){
							//Drill down has been selected, automatic jump to defined sheet, after dimension count is reached.
							if(matrix.length != 1){
								
								app.field(fieldName).clear();
								qlik.navigation.gotoSheet(selectedSheet);
							}
							
						}
					}
					
					///////////////////////Rendering Code////////////////////////////////////////
					
					$element.empty();
					
					//Create the Drill Up Button...
					if(layout.props.DrillType == "up"){
						if(!layout.props.autoDrill){
							
							$element.append('<button id="drillup_btn">'+ buttonText +'</button>');
							
						} 
						if(layout.props.autoDrill) {
						
							$element.append('<div id="drilltodetail"></div>');
							$('#drilltodetail').append('Drill up behaviour: Once the dimension count is reached, jumping to the selected sheet will occur automatically.');
							
						};
					}
					if(layout.props.DrillType == "down"){
						if(!layout.props.autoDrill){
							
							if(matrix.length==noOfDistinctValues){
								
								$element.append('<button id="drilldown_btn">'+ buttonText +'</button>');
								
							}else {
								
								//Create Button String
								var myText = '<button id="drilldown_btn_tooMany">Select ' + noOfDistinctValues + ' value(s) to activate.</button>';
								//console.log(myText);
								$element.append(myText);
							}
						}	
						
						if(layout.props.autoDrill) {
							
							$element.append('<div id="drilltodetail"></div>');
							$('#drilltodetail').append('Drill down behaviour: Once the dimension count is reached, jumping to the selected sheet will occur automatically.');
								
						};
						
					}
					
					
					//////////////////////Action Code///////////////////////////////////////////
					//Only perform actions once we are no longer in edit mode...
					if (qlik.navigation.getMode() != 'edit' ) {
					
						$element.find('#drillup_btn').on('click', function() {
							
							console.log('FieldName', fieldName);
							
							app.field(fieldName).clear();
							qlik.navigation.gotoSheet(selectedSheet);
							
							
						});
						
						$element.find('#drilldown_btn').on('click', function() {

							if(matrix.length==noOfDistinctValues){

								qlik.navigation.gotoSheet(selectedSheet);
							}
							
							
						});
					}
					//////////////////////Action Code///////////////////////////////////////////
					}
				catch(err){
					$element.empty();
					$element.append('<div>Something went wrong: ' + err + '</div>');
				}		
            }
        }
    }
);
