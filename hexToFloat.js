//AppData
const endianness = require('convert-endianness');
console.log(endianness.LE);
var mongoose = require("mongoose");
var serverDataSchema = new mongoose.Schema({
    floatData : String
});
var serverData = mongoose.model("serverData" , serverDataSchema);
mongoose.connect("mongodb://localhost/server_data" , {useNewUrlParser : true});

//Variables
const fs = require("fs");
var result = "";
var n = "";
var idArray =[];

//Reading Data
fs.readFile("data.txt" , "utf-8" , function(err,data){
    if(err){
        console.log(err);
    }
    result = result + data;      
    createData(result);
});

//Float Parser
function parseFloat(str) {
    var float = 0, sign, order, mantiss,exp,
    int = 0, multi = 1;
    if (/^0x/.exec(str)) {
        int = parseInt(str,16);
    }else{
        for (var i = str.length -1; i >=0; i -= 1) {
            if (str.charCodeAt(i)>255) {
                console.log('Wrong string parametr'); 
                return false;
            }
            int += str.charCodeAt(i) * multi;
            multi *= 256;
        }
    }
    sign = (int>>>31)?-1:1;
    exp = (int >>> 23 & 0xff) - 127;
    mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
    for (i=0; i<mantissa.length; i+=1){
        float += parseInt(mantissa[i])? Math.pow(2,exp):0;
        exp--;
    }
    return float*sign;
}

function createData(result){
    serverData.create({floatData:result} , function(err , foundData){
        if(err)
            console.log(err);
        else{
            idArray.push(foundData._id);
            n = foundData.floatData.replace(/,/g , "");
            parseData(n);
        }
    });
}

function parseData(serverData){
    var i = 6; var x =1;
    var j = 10;
    var k = j + 4;
    for(;k<n.length-8;){
    var str1 = n.slice(i , j);
    var str2 = n.slice(j , k);
    var str3 = "0x" + str2 + str1;
    console.log(str3 +":" + x);
    console.log(parseFloat(str3));
    i = i+ 8;
    j = j+ 8;
    k = j +4;
    x++;
    }    
}

