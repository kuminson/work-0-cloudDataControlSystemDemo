
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 超全局变量

// 通用链接根目录
var rooturl = "/work-0-cloudDataControlSystemDemo/";
// 通用计时器
var yg_cache = {};

// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 一级菜单跳转链接地址 直接修改地址即可

	var fstmenuurl = [
	"html/dataConfirm/dataConfirm.html",	//数据确认
	"html/fileManage/fileManage.html",	//档案管理
	"html/fileSearch/fileSearch.html",	//档案检索
	"html/clearPaper/clearPaper.html",	//整理组卷
	"html/serviceUse/serviceUse.html",	//服务利用
	"html/library/library.html",	//资源库
	"#" 	//个性化配置
	]

// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


/*
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * global_windowOpen(obj)  生成弹出型iframe窗口
 *
 * 必填参数 否则alert报错
 * url          iframe的src 不带根目录地址
 *
 * 选填参数
 * title        iframe的标题 默认为空
 *
 * ifrwidth     iframe的自定义宽度
 *                    参数为纯数字
 *                    默认值为840
 *
 * ifrheight    iframe的自定义高度
 *                    参数为纯数字
 *                    默认值为480
 *
 * func         iframe右上角关闭按钮的回调函数
 *                    参数为函数名的字符串
 *
 * full         iframe是否以全屏方式显示
 *                    参数为 true 全屏显示 其他值不全屏显示
 *                    默认值是不全屏
 *
 * idend        iframe所有id的后缀
 *                    参数为字符串
 *                    默认值是由时间生成的数字后缀
 *
 * scroll       iframe是否添加滚动条
 *                    参数为 true 添加滚动条 其他值不添加滚动条
 *                    默认值是不添加滚动条
 *
 * 使用方法
 * global_windowOpen({
 *     url: "/index.jsp",
 *     title: "文档提交",
 *     ifrwidth: 840,
 *     ifrheight: 480,
 *     func: "alert(111)",
 *     full: true,
 *     idend: "lala",
 *     scroll: true
 * });
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function global_windowOpen(obj) {
	// 判定URL 否则报错
	if(obj.url === undefined ){
		alert("url 不能为空");
	}
	var isscroll = "";
	// 判定是否添加进度条
	if(obj.scroll === undefined){
		isscroll = "no";
	}else if(obj.scroll === true){
		isscroll = "yes";
	}else{
		isscroll = "no";
	}

	var ifrw; //iframe宽度
	var ifrh; //iframe高度
	// 判定宽度ifrwidth 默认值为840
	if(obj.ifrwidth === undefined){
		ifrw = 840;
	}else{
		ifrw = parseInt(obj.ifrwidth);
	}
	// 判定高度ifrheight 默认值为480
	if(obj.ifrheight === undefined){
		ifrh = 480;
	}else{
		ifrh = parseInt(obj.ifrheight);
	}
	// 判定idend 默认为时间
	var ifrnbr;
	if(obj.idend === undefined){
		var nowdate = new Date;
		ifrnbr = nowdate.getTime();
	}else{
		ifrnbr = obj.idend;
	}
	// 判定title 默认为空
	var title;
	if(obj.title === undefined){
		title = "";
	}else{
		title = obj.title;
	}
	// 判定层次累加器
	if($(window.top.document.body).attr("yg_iframenum") === undefined){
		$(window.top.document.body).attr("yg_iframenum","0");
	}
	var ifarmenum = parseInt($(window.top.document.body).attr("yg_iframenum"));
	var _iframe_id = "yg_popdiv_";
	// 生成弹出iframe标签
	$("body").append('<div id="' + _iframe_id + ifrnbr +'" class="yg_popdiv">'
						+'<div id="yg_pi_title'+ ifrnbr +'">'
							+title
							+'<span id="yg_pi_close'+ ifrnbr +'" class="yg_p_icon"></span>'
							+'<span id="yg_pi_change'+ ifrnbr +'" class="yg_p_icon"></span>'
						+'</div>'
						+'<iframe id="yg_p_iframe'+ ifrnbr +'" yg_iframemark="0" src="'
							+rooturl + obj.url
							+'" class="yg_p_iframe" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="'
							+ isscroll +'" allowtransparency="no">'
						+'</iframe>'
					+'</div>');
	// 添加样式
	$("#"  + _iframe_id + ifrnbr).css({
		"display": "block",
		"position": "fixed",
		"z-index": 100 + ifarmenum,
		"top": "50%",
		"left": "50%",
		"height": ifrh + 28 + 1 + "px",
		"width": ifrw + "px",
		"overflow": "hidden",
		"border": "1px solid #95B8E7",
		"margin-top": 0 - ((ifrh + 1 + 28 + 1 + 1)/2) + "px",
		"margin-left": 0 - ((ifrw + 1 + 1)/2) + "px"
	});
	$("#yg_pi_title"+ifrnbr).css({
		"height": "20px",
		"padding": "4px",
		"width": ifrw - 8 + "px",
		"font-weight": "bold",
		"color": "#0E2D5F",
		"border-bottom": "1px solid #95B8E7",
		"background-color": "#E0ECFF"
	});
	$(".yg_p_icon").css({
		"display": "block",
		"height": "20px",
		"margin-left": "5px",
		"width": "20px",
		"float": "right",
		"cursor": "pointer",
		"background-image": "url('"+rooturl+"/images/common/panel_tools.png')"
	});
	$("#yg_pi_close"+ifrnbr).on("mouseover",function(){
		$(this).css("background-color","#134da5");
	});
	$("#yg_pi_close"+ifrnbr).on("mouseleave",function(){
		$(this).css("background-color","transparent");
	});
	$("#yg_pi_change"+ifrnbr).on("mouseover",function(){
		$(this).css("background-color","#134da5");
	});
	$("#yg_pi_change"+ifrnbr).on("mouseleave",function(){
		$(this).css("background-color","transparent");
	});
	$("#yg_pi_close"+ifrnbr).css({
		"background-position": "-20px 0"
	});
	$("#yg_pi_change"+ifrnbr).css({
		"background-position": "0 -20px"
	});
	$("#yg_p_iframe"+ifrnbr).css({
		"height": ifrh +"px",
		"width": ifrw +"px",
		"background-color": "#FFF"
	});
	// 绑定点击事件
	$("#yg_pi_close"+ifrnbr).on("click",function(e){
		if(obj.func === undefined){
			// 不操作
		}else{
			eval(obj.func);
		}
		$(e.target).closest(".yg_popdiv").remove();
	});
	// 判定全屏full 默认不操作
	if(obj.full === undefined){
		// 不操作
	}else if(obj.full === true){
		var winh = $(window).height();
		var winw = $(window).width();
		$("#" + _iframe_id + ifrnbr).css({
			"top": "0",
			"left": "0",
			"height": winh+"px",
			"width": winw+"px",
			"margin-top": "",
			"margin-left": ""
		});
		$("#" + _iframe_id + ifrnbr).find(".yg_p_iframe").css({
			"height": winh - 28 - 2 - 1 +"px",
			"width": winw - 2 + "px"
		});
		$("#yg_pi_title"+ifrnbr).css({
			"width": winw - 2 - 8 + "px"
		});
		$("#yg_pi_change"+ifrnbr).css({
			"background-position": "-20px -20px"
		});
	}
	// 绑定扩大缩小事件
	$("#yg_pi_change"+ifrnbr).on("click",function(e){
		if($(e.target).closest(".yg_popdiv").css("height") == ifrh + 28 + 1 + "px"){
			var winh = $(window).height();
			var winw = $(window).width();
			$(e.target).closest(".yg_popdiv").css({
				"top": "0",
				"left": "0",
				"height": winh+"px",
				"width": winw+"px",
				"margin-top": "",
				"margin-left": ""
			});
			$(e.target).closest(".yg_popdiv").find(".yg_p_iframe").css({
				"height": winh - 28 - 2 - 1 +"px",
				"width": winw - 2 + "px"
			});
			$("#yg_pi_title"+ifrnbr).css({
				"width": winw - 2 - 8 + "px"
			});
			$(e.target).css({
				"background-position": "-20px -20px"
			});
		}else{
			$(e.target).closest(".yg_popdiv").css({
				"top": "50%",
				"left": "50%",
				"height": ifrh + 28 + 1 + "px",
				"width": ifrw + "px",
				"margin-top": 0 - ((ifrh + 1 + 28 + 1 + 1)/2) + "px",
				"margin-left": 0 - ((ifrw + 1 + 1)/2) + "px"
			});
			$("#yg_pi_title"+ifrnbr).css({
				"width": ifrw - 8 + "px"
			});
			$(e.target).closest(".yg_popdiv").find(".yg_p_iframe").css({
				"height": ifrh +"px",
				"width": ifrw +"px"
			});
			$(e.target).css({
				"background-position": "0 -20px"
			});
		}
	});
	// 可拖拽
	$("#yg_pi_title"+ifrnbr).on("mousedown",function(e){
		e.stopPropagation();
		$(this).closest(".yg_popdiv").attr("mousey",e.pageY - $(this).offset().top - ((ifrh + 1 + 28 + 1 + 1)/2));
		$(this).closest(".yg_popdiv").attr("mousex",e.pageX - $(this).offset().left -((ifrw + 1 + 1)/2));
		if($(this).closest(".yg_popdiv").css("height") == ifrh + 28 + 1 + "px"){
			// 添加拖拽标记
			$(this).closest(".yg_popdiv").attr("yg_drag","0");
			$(this).closest(".yg_popdiv").css("z-index",201+ifarmenum);
			// 添加背景蒙版
			$(this).closest(".yg_popdiv").before("<div class='yg_dragback'></div>");
			$(".yg_dragback").css({
				"position": "fixed",
				"top":"0",
				"bottom": "0",
				"left": "0",
				"right": "0",
				"z-index": 200+ifarmenum
			});
			// 添加子iframe蒙版
			$(this).closest(".yg_popdiv").append("<div class='yg_dragchild'></div>");
			$(".yg_dragchild").css({
				"position": "absolute",
				"top":"30px",
				"bottom": "1px",
				"left": "1px",
				"right": "1px",
				"z-index": 202+ifarmenum
			});
		}
	});
	$(document).on("mousemove",function(e){
		var yg_dragh = e.pageY - parseInt($(".yg_popdiv[yg_drag]").attr("mousey")) + "px";
		var yg_dragw = e.pageX - parseInt($(".yg_popdiv[yg_drag]").attr("mousex")) + "px";
		$(".yg_popdiv[yg_drag]").css({
			"top": yg_dragh,
			"left": yg_dragw
		});
	});
	$(document).on("mouseup",function(e){
		$(".yg_popdiv").removeAttr("yg_drag");
		ifarmenum++;
		$(window.top.document.body).attr("yg_iframenum",ifarmenum);
		$(e.target).closest(".yg_popdiv").css("z-index",100+ifarmenum);
		$(".yg_dragback").remove();
		$(".yg_dragchild").remove();
	});
}

// 页面有多少子window
function yg_iframenbr(win){
	var nbr = 0;
	if($(win.document).find("iframe").length != 0){
		for(var i=0; i<$(win.document).find("iframe").length; i++){
			if($(win.document).find("iframe").eq(i).attr("yg_iframemark") == "0"){
				nbr++;
			}
			nbr += yg_iframenbr($(win.document).find("iframe").eq(i)[0].contentWindow);
		}
		return nbr;
	}else{
		return nbr;
	}
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * yg_dragforbtn(btn,btnparent,datagridid,cache,pop)  按钮拖拽弹出框
 *
 * btn                  为按钮选择器 字符串格式
 *
 * btnparent            为按钮一直存在的父级元素 字符串格式
 *
 * datagridid           为datagrid 选择器 字符串格式
 *
 * cache                为计时器缓存数据用 对象格式
 *
 * pop                  为需要触发的拖拽弹出函数
 *
 * 依赖函数
 * yg_iframeclear(win); 移除页面所有文件上传iframe弹出框
 *
 * 使用方法
 * var yg_cache = {};
 * yg_dragforbtn("#uploadFile_updata","#standardDir_content_Operate","#staDir_dgrid_id",yg_cache,function(){uploadFile_staDir();});
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function yg_dragforbtn(btn,btnparent,datagridid,cache,pop){
	// 绑定拖拽悬停toolbar 弹出接收框
	$(btnparent).on("dragenter",btn,function(e){
		// 判断触发事件节点e.target是否是函数所绑定的节点this
		if(this == e.target){
			if(cache.yg_dragtimer){
				clearTimeout(cache.yg_dragtimer);
			}
			// 设定指针悬停计时器
			cache.yg_dragtimer = setTimeout(function(){
				// 清除所有行的选择
				$(datagridid).datagrid("unselectAll");
				// 移除所有上传文件iframe弹出框
				yg_iframeclear(window.top);
				// 回调函数
				pop();
			},800);
		}
	});

	// 绑定离开时 清除计时器事件
	$(btnparent).on("dragleave",btn,function(e){
		// if(this == e.target){
			if(cache.yg_dragtimer){
				clearTimeout(cache.yg_dragtimer);
			}
		// }
	});
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * yg_dragforicon(icon,iconparent,datagridid,cache,pop)  datagrid图标拖拽弹出框
 *
 * icon               为datagrid easyui图标选择器 字符串格式
 *
 * iconparent         为icon图标一直存在的父元素选择器 字符串格式
 *
 * datagridid         为datagrid 选择器 字符串格式
 *
 * cache              为计时器缓存数据用 对象格式
 *
 * pop                为需要触发的拖拽弹出函数
 *
 * 依赖函数
 * yg_iframeclear(win); 移除页面所有文件上传iframe弹出框
 *
 * 使用方法
 * var yg_cache = {};
 * yg_dragforicon(".f_r_b","#standardDir_content_center","#staDir_dgrid_id",yg_cache,function(){uploadFile_staDir();})
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function yg_dragforicon(icon,iconparent,datagridid,cache,pop){
	// 绑定拖拽悬停图标 弹出接收框
	$(iconparent).on("dragenter",icon,function(e){
		// 判断触发事件节点e.target是否是函数所绑定的节点this
		if(this == e.target){
			if(cache.yg_dragtimer){
				clearTimeout(cache.yg_dragtimer);
			}
			// 设定指针悬停计时器
			cache.yg_dragtimer = setTimeout(function(){
				// 获取当前行号
				var rowindex = $(e.target).closest("tr").attr("datagrid-row-index");
				// 清除所有行的选择
				$(datagridid).datagrid("unselectAll");
				// 选中所在行
				$(datagridid).datagrid("selectRow",rowindex);
				// 移除所有上传文件iframe弹出框
				yg_iframeclear(window.top);
				// 回调函数
				pop();
			},800);
		}
	});
	// 绑定离开时 清除计时器事件
	$(iconparent).on("dragleave",icon,function(e){
		if(cache.yg_dragtimer){
			clearTimeout(cache.yg_dragtimer);
		}
	});
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * yg_iframeclear(win)  移除页面所有文件上传iframe弹出框
 *
 * win             为想清除iframe的最高window对象
 *
 * 使用方法
 * yg_iframeclear(window.top);
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function yg_iframeclear(win){
	if($(win.document).find("iframe").length != 0){
		for(var i=0; i<$(win.document).find("iframe").length; i++){
			if($(win.document).find("iframe").eq(i).attr("yg_iframemark") == "0"){
				if($(win.document).find("iframe").eq(i).prev().html().slice(0,4) == "文档提交"){
					$(win.document).find("iframe").eq(i).closest(".yg_popdiv").remove();
				}
			}
			if($(win.document).find("iframe").eq(i)[0] != undefined){
				yg_iframeclear($(win.document).find("iframe").eq(i)[0].contentWindow);
			}
		}
	}
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * getnowtime(id)  加载当前日期
 *
 * id             需要显示时间的标签id
 *
 * 使用方法
 * getnowtime("#labelid");
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function getnowtime(id){
	var timedate = {};
	timedate.now = new Date;
	timedate.year = timedate.now.getFullYear();
	timedate.month = timedate.now.getMonth()+1;
	timedate.date = timedate.now.getDate();
	timedate.day = timedate.now.getDay()+1;

	switch(timedate.day){
		case 1:
		timedate.week = "星期日";
		break;
		case 2:
		timedate.week = "星期一";
		break;
		case 3:
		timedate.week = "星期二";
		break;
		case 4:
		timedate.week = "星期三";
		break;
		case 5:
		timedate.week = "星期四";
		break;
		case 6:
		timedate.week = "星期五";
		break;
		case 7:
		timedate.week = "星期六";
		break;
	}
	$(id).html("今天是 "+ timedate.year +"年"+ timedate.month +"月"+ timedate.date +"日 "+ timedate.week);
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/*
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 * firstmenuhref(classname,hrefs)  一级菜单跳转函数
 *
 * classname             一级菜单nav的class值
 *
 * hrefs                 需要跳转的链接
 *
 * 使用方法
 * firstmenuhref(".navbar_nav_li",fstmenuurl);
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 */
// >>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function firstmenuhref(classname,hrefs){
	var menu = $(classname);
	for(var i=0; i<menu.length; i++){
		!function(i){
			menu.eq(i).on("click",function(){
				window.location.href = rooturl + hrefs[i];
			});
		}(i);
	}
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>> over  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
