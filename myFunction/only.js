function only(obj,keys){
    obj=obj||{}
    if("string"==typeof keys) keys = keys.split(/ +/) //匹配一个或多个空白字符
    return keys.reduce(function(ret,key){
        if(obj[key]==null) return ret
        ret[key] =obj[key]
        return ret
    },{})
}

let obj={
    name:"ztg",
    age:"aa",
    number:30
}

let a  = only(obj,"name age ")
console.log(a)  