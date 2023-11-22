// 开始创建虚拟的后端接口————需要使用mock来进行创建
// 引入mockjs——————并且将json格式文件一起引入进来————Mock是一个对象
import banners from './banners.json'
import floors from './floors.json'
import Mock from "mockjs";



// ————————————开始进行模拟接口的创建——————————————————————
// 提供广告位轮播数据的接口
Mock.mock('/mock/banners', {
    code: 200,
    data: banners
})

// 提供所有楼层数据的接口
Mock.mock('/mock/floors', {
    code: 200,
    data: floors
})
