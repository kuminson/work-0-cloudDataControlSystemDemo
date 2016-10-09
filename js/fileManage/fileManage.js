
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
		url: rooturl + "html/fileManage/rollTree.json"
	});
	// 加载案卷数据
	$("#mcd_roll").datagrid({
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
	// 加载文件数据
	$("#mcd_file").datagrid({
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

	
});


