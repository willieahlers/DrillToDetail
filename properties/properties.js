////////////////////////////////////////////////////
//Version: 	2.1
//Author:  	Willem Ahlers
//Usage:	Drill to detail extension scripts
//Date:		7 April 2016
////////////////////////////////////////////////////
define( [

	'jquery',
	'qlik',
	'ng!$q',
	'ng!$http'


], function ($, qlik, $q, $http) {
    'use strict';
	//Define the current application
	var app = qlik.currApp();
	//Create a function that returns a list of the sheets in the application
	var getSheetList = function (){
		var defer = $q.defer();

		app.getAppObjectList( function ( data ) {
			var sheets = [];
			var sortedData = _.sortBy( data.qAppObjectList.qItems, function ( item ) {
				return item.qData.rank;
			} );
			_.each( sortedData, function ( item ) {
				sheets.push( {
					value: item.qInfo.qId,
					label: item.qMeta.title
				} );
			} );
			return defer.resolve( sheets );
		} );

		return defer.promise;
	};
    // *****************************************************************************
    // Dimensions & Measures
    // *****************************************************************************
    var dimensions = {
        uses: "dimensions",
        min: 1,
        max: 1
    };

    var measures = {
        uses: "measures",
        min: 0,
        max: 1
    };

    // *****************************************************************************
    // Appearance Section
    // *****************************************************************************
    var appearanceSection = {
        uses: "settings"
    };
	
	// *****************************************************************************
    // Misc Section
    // *****************************************************************************
	var drillUpDownSelector = {
		
		type:"items",
		label:"Options",
		items: {
			SelectorList: {
				type:"string",
				component: "dropdown",
				label: "Select Drill-Down or Drill-Up behaviour",
				ref:"props.DrillType",
				options:[{
					value: "down",
					label: "Drill-Down"
				},{
					value: "up",
					label: "Drill-Up"
				}],
				defaultValue: "down"
			}
		}
		
	};

	var sheetList = {
		type: "string",
		component: "dropdown",
		label: "Select Sheet",
		ref: "props.selectedSheet",
		options: function () {
			return getSheetList().then( function ( items ) {
				return items;
			} );
		}
	};
	var distinctValues = {
		ref:"props.distinctValues",
		label:"Enter the number of distinct values for drilldown",
		type: "string",
		expression: "optional",
		defaultValue:"1",
		show: function ( drillUpDownSelector ) {
			return drillUpDownSelector.props.DrillType === 'down'
		}
	};
	
	var autoDrill ={
		type: "boolean",
		component: "switch",
		label: "Drill Behaviour (Auto or Button)",
		ref: "props.autoDrill",
		options: [{
			value: true,
			label: "Auto Drill"
		}, {
			value: false,
			label: "Use Button"
		}],
		defaultValue: false
		
	};
	
	var buttonText = {
		ref:"props.ButtonText",
		label:"Enter the button caption",
		type: "string",
		expression: "optional",
		defaultValue:"Button Caption",
		show: true
	};
	
	var Options = {
		type:"items",
		label:"Options",
		items: {
			drillUpDownSelector:drillUpDownSelector,
			distinctValues:distinctValues,
			sheetList:sheetList,
			autoDrill:autoDrill,
			buttonText:buttonText
		}
	
	};
	
    // *****************************************************************************
    // Main property panel definition
    // ~~
    // Only what's defined here will be returned from properties.js
    // *****************************************************************************
	  
	//******************************************************************************

    return {
        type: "items",
        component: "accordion",
        items: {
            //Default Sections
			dimensions: dimensions,
            //measures: measures,
            //appearance: appearanceSection,

			//Custom Sections
			Options: Options
			//MyColorPicker: MyColorPicker
			//miscSettings: miscSettings

        }
    };

} );
