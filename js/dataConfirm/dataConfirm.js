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
		url: rooturl + "html/dataConfirm/rollTree.json"
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
			},{
				"field":"zj",
				"title":"组卷",
				"align":"left",
				"width":60
			},{
				"field":"bzh",
				"title":"备注",
				"align":"left",
				"width":100,
				"iscp":0
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