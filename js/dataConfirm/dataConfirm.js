// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度
var yg_secondcache = {};          // 二级目录数据缓存
var yg_nowrowid;                  // 当前选中的行id

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 加载树数据
	$("#mtb_tree").tree({
		method: "get",
		url: rooturl + "html/dataConfirm/rollTree.json",
		onClick:function(node){
			if(node.id == "1432358627578491"){
				$("#mcd_datagrid").datagrid({
					method: "get",
					columns:datacolumn,
					url:rooturl + "html/dataConfirm/datagridclick1.json"
				});
			}
			if(node.id == "bala08030200"){
				$("#mcd_datagrid").datagrid({
					method: "get",
					columns:datacolumn2,
					url:rooturl + "html/dataConfirm/datagridclick3.json"
				});
			}
			if(node.id == "bala08030700"){
				$("#mcd_datagrid").datagrid({
					method: "get",
					columns:datacolumn2,
					url:rooturl + "html/dataConfirm/datagridclick4.json"
				});
			}
			if(node.id == "143235862759341"){
				$("#mcd_datagrid").datagrid("loadData",{rows:[]});
			}
		}
	});

	// 绑定刷新按钮事件
	$("body").on("click","#uploadFile_refresh",function(){
		$("#mcd_datagrid").datagrid({
		method: "get",
			url:rooturl + "html/dataConfirm/datagridclick2.json"
		});
	});

	// 绑定点击原文事件
	$("body").on("click",".frsfile",function(){
		window.open(rooturl + "resource/pdf/12100AR-M.pdf");
	});

	// 加载datagrid数据
	var datacolumn = [[
			{
				"field":"",
				"checkbox":true
			},{
				"field":"yw",
				"title":"原文",
				"align":"center",
				"width":30
			},{
				"field":"wjbh",
				"title":"文件编号",
				"align":"left",
				"width":100,
				"iscp":1
			},{
				"field":"wjmc",
				"title":"文件名称",
				"align":"left",
				"width":290,
				"iscp":1
			},{
				"field":"fs",
				"title":"份数",
				"align":"left",
				"width":60,
				"iscp":0
			},{
				"field":"zzs",
				"title":"纸张数",
				"align":"left",
				"width":60,
				"iscp":0
			}
			// ,{
			// 	"field":"zj",
			// 	"title":"组卷",
			// 	"align":"left",
			// 	"width":60
			// }
			,{
				"field":"bzh",
				"title":"备注",
				"align":"left",
				"width":100,
				"iscp":0
			}
			]];
	var datacolumn2 = [[
			{
				"field":"",
				"checkbox":true
			},{
				"field":"yw",
				"title":"原文",
				"align":"center",
				"width":30
			},{
				"field":"wjbh",
				"title":"文件编号",
				"align":"left",
				"width":100,
				"iscp":1
			},{
				"field":"wjmc",
				"title":"文件名称",
				"align":"left",
				"width":290,
				"iscp":1
			},{
				"field":"fs",
				"title":"份数",
				"align":"left",
				"width":40,
				"iscp":0
			},{
				"field":"zzs",
				"title":"纸张数",
				"align":"left",
				"width":40,
				"iscp":0
			},{
				"field":"sbwh",
				"title":"设备位号",
				"align":"left",
				"width":60,
				"iscp":0
			},{
				"field":"sbxh",
				"title":"设备型号",
				"align":"left",
				"width":60,
				"iscp":0
			},{
				"field":"bzh",
				"title":"备注",
				"align":"left",
				"width":60,
				"iscp":0
			}
			]];
	$("#mcd_datagrid").datagrid({
		toolbar: "#mc_tb",
		method: "get",
		url: rooturl + "html/dataConfirm/datagrid.json",
		fitColumns: true,
		columns:datacolumn,
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
		yg_nowrowid = $("#mcd_datagrid").datagrid("getChecked")[0].sjid;
		yg_secondcache[yg_nowrowid] = [];
		popuploadiframe();
	});

	// 动态绑定文件夹图标 点击弹出二级目录
	$("#m_content").on("click",".secindex",function(e){
		var rowindex = $(e.target).closest("tr").attr("datagrid-row-index");
		$("#mcd_datagrid").datagrid("clearChecked");
		$("#mcd_datagrid").datagrid("selectRow",rowindex);
		yg_nowrowid = $("#mcd_datagrid").datagrid("getSelected").sjid;
		global_windowOpen({
			url: "html/secondData/secondData.html",
			title: "工程资料",
			ifrwidth: 840,
			ifrheight: 480,
			idend: "second"
		});
	});

	// 绑定组卷链接按钮点击事件
	$("body").on("click",".groupfile",function(){
		var rowindex = $(this).closest("tr").attr("datagrid-row-index");
		$(this).html("");
		$(this).prepend('<span class="l-btn-icon icon-xnzj_wjz"></span>');
		for(var i=rowindex-1; i>=0; i--){
			var over =$("#mcd_datagrid").datagrid("getPanel").find("tr[datagrid-row-index='"+i+"']").has(".groupicon").length;
			if(over != 0){
				break;
			}
			$("#mcd_datagrid").datagrid("getPanel").find("tr[datagrid-row-index='"+i+"']").has(".groupfile").find(".groupfile").remove();
		}
		$(this).removeClass("groupfile");
		$(this).addClass("groupicon");
	});
	// 生成没有组卷的列标题
	var fcgridcol =[];
	fcgridcol[0] = datacolumn[0].slice();
	fcgridcol[0].splice(-2,1);
	// 配置表格信息
	$("#fc_grid").datagrid({
		fitColumns: true,
		columns:fcgridcol,
		resizeHandle: "both",
		striped: true,
		loadMsg: "请稍后...",
		pagination: true,
		rownumbers: true,
		pageNumber: 1,
		pageSize: 20,
		pageList: [20,40,60]
	});

	// 绑定组卷icon点击弹出窗口事件
	$("body").on("click",".groupicon",function(){
		// 显示弹窗
		$("#frame_composition").window("open");
		$("#frame_composition").triggerHandler("resize");
		// 初始化案卷信息
		var prodata = {
			"columnno":0,
			"sjid":"140791339904614a00",
			"allnbr":"002",
			"fstclass":"011",
			"scdclass":"0111",
			"indexnbr":"01",
			"deadline":"永久",
			"order":"54",
			"filenbr":"002-WS-01-YJ-0054",
			"user":"党办",
			"filename":"石臼港务管理局党委一九八七年会议记录",
			"pagenbr":"53",
			"year":"1987",
			"unit":""
		};
		var prokey = ["order","filenbr","deadline","filename","pagenbr","user"];
		adddataforinfo(prodata,prokey);
		// 初始化表格数据
		$("#fc_grid").datagrid("loadData",{rows:[]});
		// 加载表格数据
		// 获取点击图标所在行号
		var rowindex = $(this).closest("tr").attr("datagrid-row-index");
		// 获取所有数据
		var rowdata = $("#mcd_datagrid").datagrid("getRows");
		// 加载图标所在行数据
		$("#fc_grid").datagrid("appendRow",rowdata[rowindex]);
		// 加载图标上面行数据
		for(var i=rowindex-1; i>=0; i--){
			var over =$("#mcd_datagrid").datagrid("getPanel").find("tr[datagrid-row-index='"+i+"']").has(".groupicon").length;
			if(over != 0){
				break;
			}
			$("#fc_grid").datagrid("appendRow",rowdata[i]);
		}
	});
});


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

// 加载案卷信息函数
function adddataforinfo(data,key){
	for(var i=0; i<key.length; i++){
		if(data[key[i]] == undefined){
			$(".fcii_text").eq(i).textbox("setValue","");
		}else{
			$(".fcii_text").eq(i).textbox("setValue",data[key[i]]);
		}
	}
}