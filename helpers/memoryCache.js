var _Cache = {};

function setCache(key,value,expTime){
    var curTimeInSec = new Date().getTime() / 1000;
    if (typeof key == 'string' && value != null && typeof expTime == 'number' ) {
        _Cache[key] = {
            val: value,
            exp: curTimeInSec + expTime
        };
        //cb(null,{status:200,desc:'setting cache success'});
        return true;
    }else{
        //cb({status:500,desc:'setting cache fail'});
        return false;
    }
}

function getFromCache(key){
    var curTimeInSec = new Date().getTime() / 1000;

    var entry = _Cache[key];

    if (entry !== undefined) {

        if(entry.exp > curTimeInSec){
            //cb(null, {status:200, desc:'getting cache success', data: entry.val});
            return entry.val;
        }else{
            // expired
            //cb({status:500, desc:'cache expired'});
            return null;
        }
       
    }else{
        //cb({status:404,desc:'key not found'});
        return null;
    }
}


exports.setCache = setCache;

exports.getFromCache = getFromCache;