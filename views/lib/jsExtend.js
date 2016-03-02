Array.prototype.remove = function(obj){
        var flag = false;
        for(var i=0;i<this.length;i++){
            if(this[i] == obj){
                flag = !flag;
                break;
            }
        }
        if(flag)this.splice(i,1);
}