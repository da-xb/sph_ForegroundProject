// 用来写一些常用的功能模块
import {v4 as uuidv4} from 'uuid';

/**
 * 生成一个随机的字符串，并且每次执行生成的字符串都相同，用来表明游客身份（保存到localstorage中去）
 */
export const getUUID = function () {
    /*
    思路：
    1、先从localstorage中获取uuid，如果有则返回这个uuid
    2、如果没有uuid，则生成一个uuid返回出去，并保存再localstorage中去
     */
    let uuid_token = localStorage.getItem("UUIDTOKEN")
    if (!uuid_token) {
        uuid_token = uuidv4();
        localStorage.setItem("UUIDTOKEN", uuid_token)
    }
    return uuid_token;
}
