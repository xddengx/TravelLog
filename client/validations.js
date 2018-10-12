//date including leap years since 1900 mm and dd could have 1 or 2 digits with 4 digit year and / separator
function date1(value){
    let reg = new RegExp("/^(((0?[1-9]|1[012])\/(0?[1-9]|1\d|2[0-8])|(0?[13456789]|1[012])\/(29|30)|(0?[13578]|1[02])\/31)\/(19|[2-9]\d)\d{2}|0?2\/29\/((19|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00)))$/");
    
    return reg.test(value);
}

// Date with leap years. Accepts '.' '-' and '/' as separators d.m.yy to dd.mm.yyyy (or d.mm.yy, etc) 
//Ex: dd-mm-yyyy d.mm/yy dd/m.yyyy etc etc Accept 00 years also.
function date2(value){
    let reg = new RegExp("/^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/");
    
    return reg.test(value);
}

// mm/dd/yyyy format
function date3(value) { 
    let reg = new RegExp(/(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/);

    return reg.test(value);
}

// mm-dd-yyyy
function date4(value) {
    let reg = new RegExp("/(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d/");

    return reg.test(value);
}

// check image url
function imageValid(value) {
    let reg = new RegExp('/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png/g');

    return reg.test(value);
}

function testing(value){
    let reg = new RegExp("/^[A-Za-z0-9]+$/");
    
    return reg.test(value);
}