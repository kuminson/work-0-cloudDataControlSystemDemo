
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
		method: "get",
		url: rooturl + "html/fileManage/rollTree.json"
	});
	// 加载案卷数据
	$("#mcd_roll").datagrid({
		method: "get",
		url: rooturl + "html/fileManage/rolldata.json",
		fitColumns: true,
		columns:[[
			{
				"field":"",
				"checkbox":true,
				"width":50
			},{
				"field":"allnbr",
				"title":"全综号",
				"align":"left",
				"width":50
			},{
				"field":"fstclass",
				"title":"一级类目",
				"align":"left",
				"width":50
			},{
				"field":"scdclass",
				"title":"二级类目",
				"align":"left",
				"width":50
			},{
				"field":"indexnbr",
				"title":"目录号",
				"align":"left",
				"width":50
			},{
				"field":"deadline",
				"title":"保管期限",
				"align":"left",
				"width":50
			},{
				"field":"order",
				"title":"案卷序号",
				"align":"left",
				"width":50
			},{
				"field":"filenbr",
				"title":"案卷档号",
				"align":"left",
				"width":110
			},{
				"field":"user",
				"title":"责任者",
				"align":"left",
				"width":110
			},{
				"field":"filename",
				"title":"案卷题名",
				"align":"left",
				"width":220
			},{
				"field":"pagenbr",
				"title":"页数",
				"align":"left",
				"width":50
			},{
				"field":"year",
				"title":"年度",
				"align":"left",
				"width":50
			},{
				"field":"unit",
				"title":"单位",
				"align":"left",
				"width":110
			}
			]],
		onClickRow:function(index,row){
			$("#mcd_file").datagrid({
				url: rooturl + "html/fileManage/filedata"+(index%4)+".json"
			});
		},
		resizeHandle: "both",
		striped: true,
		loadMsg: "请稍后...",
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageNumber: 1,
		pageSize: 20,
		pageList: [20,40,60]
	});
	// 加载文件数据
	$("#mcd_file").datagrid({
		method: "get",
		// url: rooturl + "html/fileManage/filedata3.json",
		fitColumns: true,
		columns:[[
			{
				"field":"",
				"checkbox":true,
				"width":50
			},{
				"field":"ori",
				"title":"原件",
				"align":"left",
				"width":50
			},{
				"field":"allnbr",
				"title":"全综号",
				"align":"left",
				"width":50
			},{
				"field":"fstclass",
				"title":"一级类目",
				"align":"left",
				"width":50
			},{
				"field":"scdclass",
				"title":"二级类目",
				"align":"left",
				"width":50
			},{
				"field":"indexnbr",
				"title":"目录号",
				"align":"left",
				"width":50
			},{
				"field":"deadline",
				"title":"保管期限",
				"align":"left",
				"width":50
			},{
				"field":"order",
				"title":"案卷序号",
				"align":"left",
				"width":50
			},{
				"field":"orderfile",
				"title":"文件序号",
				"align":"left",
				"width":50
			},{
				"field":"filenbr",
				"title":"案卷档号",
				"align":"left",
				"width":110
			},{
				"field":"filename",
				"title":"案卷题名",
				"align":"left",
				"width":220
			},{
				"field":"year",
				"title":"年度",
				"align":"left",
				"width":50
			},{
				"field":"user",
				"title":"责任者",
				"align":"left",
				"width":110
			},{
				"field":"essaynbr",
				"title":"文号",
				"align":"left",
				"width":110
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


