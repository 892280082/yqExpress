var _ =require("underscore");
var array = _.range(21);


console.log(_.reduce(array,function(mem,ele){
                    var subArray = _.last(mem);
                    subArray.length<4 ? subArray.push(ele) : mem.push([]);

                    var lasts = _.last(mem);
                    var delx =Array.length - _.flatten(mem).length;
                    var lastArray = _.last(mem);
                    if(delx<5 &&  lastArray.length === 0)
                        lastArray.push(ele);

                    return mem;
                },[[]]));