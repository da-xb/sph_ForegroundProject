//对axios进行二次的封装——————便于项目去请求后端数据
/**
 * 这个方法是用于mock虚拟数据发送请求
 */
// 1.先引入axios
import axios from 'axios'

// 2、引入进度条——————当进行数据请求的时候就开始展示进度条了
import nProgress from 'nprogress';
// 3、引入进度条样式
import 'nprogress/nprogress.css'


// 先实例化一个axios,然后进行配置
// 利用axios对象的方法create
const mockRequest = axios.create({
	timeout: 5000,//配置请求超时时间
	baseURL: "/mock",  //（基础路径）baseURL 将自动加在 url 前面，除非 url 是一个绝对 URL。
})


// 请求拦截器-- - 再请求发送之前去做一些东西(给mockRequest这个请求实例创建一个请求拦截器, 里面的就是再拦截的时候进行的一些操作)
mockRequest.interceptors.request.use(
	// config：配置对象，对象里面有一个属性很重要，headers请求头
	(config) => {
		nProgress.start();//进度条开始
		return config;
	},
	(error) => {
		// 处理请求错误
		return Promise.reject(new Error('error'));
	});


// 响应拦截器(当服务器收到请求,并且响应请求后返回数据时进行拦截然后进行一些操作)
mockRequest.interceptors.response.use(
	res => {
		// 这里是数据返回成功后的回调函数
		nProgress.done();//进度条结束
		return res.data;
	},
	error => {
		// 服务器响应失败的回调函数
		return Promise.reject(new Error('fail'));
	}
)


// 将封装好的axios暴露出去
export default mockRequest;