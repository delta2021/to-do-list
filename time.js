
exports.getDay=()=>{
const options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
const day = new Date().toLocaleDateString('en-US', options);
return day;
}





