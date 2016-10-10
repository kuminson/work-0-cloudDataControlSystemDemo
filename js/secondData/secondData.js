// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var tempdata;       //文件名列表  array格式
var griddata = [];  //用于加载在datagrid的数据

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 取出主页面缓存上传数据名称列表
	tempdata = window.top.yg_secondcache[window.top.yg_nowrowid];
	// 转换成datagrid可加载格式
	for(var i=0; i<tempdata.length; i++){
		var dataobj = {};
		dataobj.columnno = i;
		dataobj.yw = "\u003cimg class\u003d\u0027f_r_b\u0027 src\u003d\u0027/work-0-cloudDataControlSystemDemo/images/common/search.png\u0027 style\u003d\u0027cursor:pointer\u0027/\u003e";
		dataobj.wjmc = tempdata[i];
		griddata.push(dataobj);
	}
	// 加载datagrid表格
	$("#sec_datagrid").datagrid({
		method: "get",
		toolbar: "#mc_tb",
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
		data: griddata,
		resizeHandle: "both",
		striped: true,
		loadMsg: "请稍后...",
		pagination: true,
		rownumbers: true,
		pageNumber: 1,
		pageSize: 20,
		pageList: [20,40,60]
	});
});