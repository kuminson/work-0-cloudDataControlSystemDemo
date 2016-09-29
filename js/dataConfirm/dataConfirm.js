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

$(function(){
	// 加载时间
	getnowtime("#header_date");
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);
	// 加载树数据
	$("#mtb_tree").tree({
		url: rooturl + "json/dataConfirm/tree.json"
	});
	// 加载datagrid数据
	// 宽高弹性
});

// 链接根目录地址
var rooturl = "/E:/kuminson/project/8 cloud data control system/work-0-cloudDataControlSystemDemo/"

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

// 加载树结构数据
function yg_treedataload(){

}
// 加载表格数据