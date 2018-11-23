/*
	我们在这里边写主页的js代码
	注意这里编写的代码函数，必须按照requirejs的AMD规范去编写。
*/
/*
	第一个参数，是我们要引入的模块
	第二个参数，是当模块引入以后，我们要做的操作。
		【注】在回调函数中使用模块中的函数的时候，一定要当做参数传入
*/

define(["jquery", "jquery-cookie"], function($){
	var main = function(){

		$(function(){

			sc_car(); //显示当前页面上已经添加商品数量
			
			//<1>加载数据
			$.ajax({
				url: "data/data.json",
				type: "GET",
				success: function(arr){

					//<2>将数据进行解析，并且添加到页面上
					var html = "";
					for(var i = 0; i < arr.length; i++){
						html += `<li class = "goods_item">
					<div class = "goods_pic">
						<img src="${arr[i].img}" alt="">
					</div>
					<div class = "goods_title">
						<p>商品描述</p>
					</div>
					<div class = "sc_btn" id = "${arr[i].id}">加入购物车</div>
				</li>`;
					}

					//<3>添加页面上
					$(".goods_box ul").html(html);
				}
			})


			//<2>给购物车按钮添加点击事件   原因，数据异步下载，和主代码执行是没有关联的。
			//当我们执行到给购物车按钮添加点击事件，我们的数据还没有加载出来。
			/*
				通过事件委托，将加入购物车的点击事件，添加到加入购物车按钮的父级上。

				on() 完成事件委托

				第一个参数：添加事件类型
				第二个参数：委托对象
				第三个参数：事件处理函数
			*/

			$(".goods_box").on("click", ".sc_btn", function(){
				//<1>判断是否是第一次添加cookie
				// alert(this.id);
				var id = this.id;
				var first = $.cookie("goods") == null ? true : false;
				
				if(first){
					//<2>如果是第一次添加 [{id:id,num:2}]  json格式的字符串进行记录
					//格式是数组里面包含着每一个商品的信息的对象
					$.cookie("goods", '[{id:' + id + ',num:1}]', {
						expires: 7
					})
				}else{
					//<3>判断是否之前添加过该商品
					var str = $.cookie("goods");
					var arr = eval(str);
					var same = false; //代表是否有相同的商品出现

					//遍历这个数组中所有的对象，判断是否id相同的，如果有id相同的 num++
					for(var i in arr){
						if(arr[i].id == id){
							arr[i].num = arr[i].num + 1;
							//数量+1以后，再把这个cookie存储进行
							var cookieStr = JSON.stringify(arr);

							$.cookie("goods", cookieStr, {
								expires: 7
							});
							same = true; //有相同的商品出现。
							break;
						}
					}


					//<4>没有相同的商品 新增该cookie
					if(!same){
						var obj = {id: id, num: 1};
						arr.push(obj);
						var cookieStr = JSON.stringify(arr);
						$.cookie("goods", cookieStr, {
							expires: 7
						})
					}
				}
				console.log($.cookie("goods"));
				sc_car(); //点击加入购物车按钮以后，数量更新
			})

			//购物车数字
			function sc_car(){
				//<1>取出存储好的cookie
				var sc_str = $.cookie("goods");
				if(sc_str){
					var sc_arr = eval(sc_str);
					//用来记录累加的和
					var sc_num = 0;
					for(var i in sc_arr){
						sc_num += Number(sc_arr[i].num);
					}
					//<2>商品的总数
					$(".sc_num").html(sc_num);
				}
			}

			/*
				mouseenter  移入
				mouseleave  移出
			*/
			$(".sc_right").mouseenter(function(){
				
				$(this).stop().animate({
					right: 0
				})
				sc_msg();
			});

			$(".sc_right").mouseleave(function(){
				$(this).stop().animate({
					right: -270
				})
			});

			/*
				加载已经存储在cookie中的数据
			*/
			function sc_msg(){
				//<1>再去将原来的数据下载
				//<2>通过cookie中存储的数据加载对应的商品
				$.ajax({
					url: "data/data.json",
					type: "get",
					success: function(res){
						//<3>数据取出，并且转成对应的数组
						var sc_arr = eval($.cookie("goods"));
						var html = "";
						for(var i in sc_arr){
							html += `
								<li>
					<div class = "sc_goodsPic">
						<img src="${res[sc_arr[i].id].img}" alt="">
					</div>
					<div class = "sc_goodsTitle">
							<p>这里是商品描述</p>
					</div>
					<div class = "sc_goodsBtn" id = "${sc_arr[i].id}">购买</div>
					<div class = "sc_goodsNum">商品数量${sc_arr[i].num}</div>
				</li>`;
						}
						// alert(html);
						$(".sc_right ul").html(html);
					}
				})
			}

		})

		return "我是main函数";
	}
	return {
		main: main
	}
})






