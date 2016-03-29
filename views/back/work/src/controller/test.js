var _ = require("underscore");
var tttt = [{name:"aaa1"},{name:"aaa1"},{name:"aaa1"},{name:"aaa1"},{name:"aaa2"},{name:"aaa2"},{name:"aaa1"},{name:"aaa1"}]

console.log(tttt.length);

            var groupArray = function(Array){
            	var mem = [{array:[]}];
        		for(var i=0;i<Array.length;i++){
    				 var lastArray = _.last(mem).array;
    				 if(lastArray.length<4){
    				 	lastArray.push(Array[i]);
    				 }else{
				 		 mem.push({array:[]});
				 		 i--;
    				 }
        		}
        		return mem;

            }

console.log(groupArray(tttt));
