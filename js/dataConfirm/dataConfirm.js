// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 一级菜单跳转链接地址 直接修改地址即可

	var fstmenuurl = [
	"#",	//数据确认
	"#",	//档案管理
	"#",	//档案检索
	"#",	//整理组卷
	"#",	//服务利用
	"#",	//资源库
	"#" 	//个性化配置
	]

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度
var yg_secondcache = {};          // 二级目录数据缓存
var yg_nowrowid;                  // 当前选中的行id

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 加载时间
	getnowtime("#header_date");
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);
	// 加载树数据
	$("#mtb_tree").tree({
		url: rooturl + "html/dataConfirm/tree.json"
	});
	// 加载datagrid数据
	$("#mcd_datagrid").datagrid({
		toolbar: "#mc_tb",
		url: rooturl + "html/dataConfirm/datagrid.json",
		fitColumns: true,
		columns:[[
			{
				"field":"",
				"checkbox":true
			},{
				"field":"yw",
				"title":"原文",
				"align":"center",
				"width":30,
				"type":"VARCHAR2(50)",
				"sortable":true
			},{
				"field":"wjbh",
				"title":"文件编号",
				"align":"left",
				"width":100,
				"type":"VARCHAR2(150)",
				"sortable":true,
				"editor":"text",
				"iscp":1,
				"attr":{"toolTipMessage":""}
			},{
				"field":"wjmc",
				"title":"文件名称",
				"align":"left",
				"width":290,
				"type":"VARCHAR2(200)",
				"sortable":true,
				"editor":"text",
				"iscp":1,
				"attr":{"toolTipMessage":""}
			},{
				"field":"xcsj",
				"title":"文件形成时间",
				"align":"left",
				"width":100,
				"type":"DATE",
				"sortable":true,
				"editor":{"type":"my97"},
				"iscp":0,
				"attr":{"toolTipMessage":""}
			},{
				"field":"zzs",
				"title":"纸张数",
				"align":"left",
				"width":60,
				"type":"NUMBER",
				"sortable":true,
				"editor":"text",
				"iscp":0,
				"attr":{"toolTipMessage":""}
			},{
				"field":"fs",
				"title":"份数",
				"align":"left",
				"width":60,
				"type":"NUMBER(12)",
				"sortable":true,
				"attr":{"toolTipMessage":""}
			},{
				"field":"bzh",
				"title":"备注",
				"align":"left",
				"width":100,
				"type":"VARCHAR2(300)",
				"sortable":true,
				"editor":"text",
				"iscp":0,
				"attr":{"toolTipMessage":""}
			}
			]],
		resizeHandle: "both",
		striped: true,
		loadMsg: "请稍后...",
		pagination: true,
		rownumbers: true,
		pageNumber: 1,
		pageSize: 20,
		pageList: [20,40,60]
	});
	// 宽高弹性
	$(window).resize(function(){
		if($(window).width() > pageminwidth){
			$(".main").css("width",$(window).width() + "px");
		}else{
			$(".main").css("width",pageminwidth + "px");
		}
		if($(window).height() > pageminheight){
			$(".main").css("height",$(window).height() - $(".head").height() - $(".navbar").height() - bottomheight);
		}else{
			$(".main").css("height",pageminheight - $(".head").height() - $(".navbar").height() - bottomheight);
		}
	});
	$(window).triggerHandler("resize");

	// 绑定拖拽至图标 弹出拖拽框
	yg_dragforicon(".f_r_b","#m_content","#mcd_datagrid",yg_cache,function(){
		yg_nowrowid = $("#mcd_datagrid").datagrid("getChecked").sjid;
		popuploadiframe();
	});
});


// 加载当前日期
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

// 一级菜单跳转函数
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

// 弹出拖拽上传页面函数
function popuploadiframe(){
	global_windowOpen({
		url: "html/dropUpload/dropUpload.html",
		title: "文档提交",
		ifrwidth: 600,
		ifrheight: 150,
		idend: "lala",
		scroll: true
	});
}