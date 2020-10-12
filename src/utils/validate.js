/**
 * Created on 20/04/18.
 */

/**
 * 合法uri
 **/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}


/**
 * 小写字母
 **/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/**
 * 大写字母
 **/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/**
 * 大小写字母
 **/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
    if (typeof val === 'boolean') {
        return false;
    }
    if (val instanceof Array) {
        if (val.length === 0) return true;
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === '{}') return true;
    } else {
        if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true;
        return false;
    }
    return false;
}

/**
 * 判断手机号码是否正确
 */
export function checkPhoneNumber(phone) {
    const list = [];
    let result = true;
    let msg = '';
    const isPhone = /^0\d{2,3}-?\d{7,8}$/;
    // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
    // const isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
    if (!validatenull(phone)) {
        if (phone.length === 11) {
            if (!isPhone.test(phone)) {
                msg = '手机号码格式不正确';
                result = false;
            }
        } else {
            msg = '手机号码长度不为11位';
        }
    } else {
        msg = '手机号码不能为空';
    }
    list.push(result);
    list.push(msg);
    return list;
}

/**
 * 判断邮箱是否正确
 */
export function checkEmail(email) {
    const list = [];
    let result = true;
    let msg = '';
    const regEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (!validatenull(email)) {
        if (!regEmail.test(email)) {
            result = false;
            msg = '邮箱地址填写有误';
        }
    } else {
        result = false;
        msg = '邮箱地址不能为空';
    }
    list.push(result);
    list.push(msg);
    return list;
}

/**
 * 判断IP地址是否正确
 */
export function checkIp(ip) {
    const list = [];
    let result = true;
    let msg = '';
    const regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (!validatenull(ip)) {
        if (!regIP.test(ip)) {
            result = false;
            msg = 'IP地址填写有误';
        }
    } else {
        result = false;
        msg = 'IP地址不能为空';
    }
    list.push(result);
    list.push(msg);
    return list;
}

/**
 * 判断身份证是否正确
 */
export function checkIdCard(idcard) {
    const list = [];
    let result = true;
    let msg = '';
    const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!validatenull(idcard)) {
        if (idcard.length === 11) {
            if (!regIdCard.test(idcard)) {
                result = false;
                msg = '身份证号填写有误';
            }
        } else {
            msg = '身份证号码长度为18位';
        }
    } else {
        msg = '身份证号码不能为空';
    }
    list.push(result);
    list.push(msg);
    return list;
}
