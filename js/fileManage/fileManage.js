﻿
var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度
var yg_secondcache = {};          // 二级目录数据缓存
var yg_nowrowid;                  // 当前选中的行id
var yg_timeout;                   // 计时器

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 加载树数据
	$("#mta_otree").tree({
		url: rooturl + "html/fileManage/rollTree.json"
	});
	$("#mta_ltree").tree({
		url: rooturl + "html/fileManage/rollTree.json",
		onLoadSuccess: function(){
			// 初始化文件列表
			initfilelist();
		},
		onClick: function(node){
			// 清除列表
			$(".mcb_list").remove();
			// 加载文件列表
			if(node.children == undefined){
				$.ajax({
					url: rooturl + "html/fileManage/filerootdata.json",
					type: "POST",
					dataType: "json",
					success:function(data){
						for(var i=0; i<data.rows.length; i++){
							$("#mco_fimana").append('<li class="mcb_list">'
											+'<span class="mcbl_icon mcbl_file"></span>'
											+'<h3 class="mcbl_name">' + data.rows[i].filename + '</h3>'
										+'</li>');
						}
					},
					error:function(){
						alert("服务器链接失败！")
					}
				});
			}else{
				// 加载文件列表
				addfilelist(node.children);
			}
			// 初始化面包屑title
			$("#mcl_filebox").panel("header").children(".panel-title").html('<span class="p_title" easyid="">资源库</span>');
			// 加载面包屑title
			var titlenames = [];
			var titleid = [];
			var parentnode = $("#mta_ltree").tree("getParent",node.target);
			titlenames.push(node.text);
			while(parentnode != null){
				titlenames.push(parentnode.text);
				titleid.push(parentnode.id);
				parentnode = $("#mta_ltree").tree("getParent",parentnode.target);
			}
			var titlenamenbr = titlenames.length;
			for(var i=0; i<titlenamenbr; i++){
				var paneltitle = $("#mcl_filebox").panel("header").children(".panel-title");
				paneltitle.html(paneltitle.html() +'<span class="p_title" easyid="'+titleid.pop()+'">&gt;'+titlenames.pop()+'</span>');
			}
			// 展开树结构
			$("#mta_ltree").tree("expandTo",node.target);
			$("#mta_ltree").tree("expand",node.target);
		}
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

	// 绑定accordion点击事件
	$("#mt_accor").accordion({
		onSelect:function(title,index){
			// 隐藏所有tabs
			$(".mc_tab").addClass("hide");
			// 显示选中tabs
			switch(index){
				case 0:
					$("#mc_original").removeClass("hide");
					break;
				case 1:
					$("#mc_library").removeClass("hide");
					break;
				case 2:
					$("#mc_name").removeClass("hide");
					break;
			}
			// 主动触发resize事件 修复显示问题
			$(window).triggerHandler("resize");
		}
	});

	// 绑定tabs点击事件
	$("#mc_original").tabs({
		onSelect:function(title,index){
			if(index == 1){
				
				// 主动触发resize事件 修复显示问题
				$(window).triggerHandler("resize");
			}
		}
	});

	// 绑定双击文件夹进入事件
	$("#mco_fimana").on("dblclick",".mcb_list",function(e){
		if($(this).attr("easyid") != undefined){
			var treenode = $("#mta_ltree").tree("find",$(this).attr("easyid"));
			// 触发点击事件
			$(treenode.target).trigger("click");
			// 收敛所有树结构
			$("#mta_ltree").tree("collapseAll");
			// 展开树结构
			$("#mta_ltree").tree("expandTo",treenode.target);
			$("#mta_ltree").tree("expand",treenode.target);
		}
	});

	// 绑定单击文件列表 触发选中状态
	$("#mco_fimana").on("click",".mcb_list",function(e){
		$(".mcb_list").removeClass("active");
		$(this).addClass("active");
	});

	// 绑定点击penal title跳转事件
	$("#datagrid_content").on("click",".p_title",function(){
		var easyid = $(this).attr("easyid");
		if(easyid != "undefined"){
			if(easyid == ""){
				// 初始化文件列表
				initfilelist();
				// 收敛所有树结构
				$("#mta_ltree").tree("collapseAll");
			}else{
				var treenode = $("#mta_ltree").tree("find",easyid);
				// 触发点击事件
				$(treenode.target).trigger("click");
				// 收敛所有树结构
				$("#mta_ltree").tree("collapseAll");
				// 展开树结构
				$("#mta_ltree").tree("expandTo",treenode.target);
				$("#mta_ltree").tree("expand",treenode.target);
			}
		}
	});

	// 加载元数据备份列表
	$("#mco_backup").datagrid({
		url: rooturl + "html/fileManage/metadatabackup.json",
		toolbar:"#mco_tb",
		fitColumns: true,
		striped: true,
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageSize:20,
		pageList:[20,40,60],
		columns:[[
			{field:"bptime",title:"备份时间",width:100},
			{field:"bpmode",title:"备份方式",width:100},
			{field:"bpuser",title:"备份人",width:100},
			{field:"bpresult",title:"备份结果",width:100}
		]]
	});
	// 加载权限人名库备份列表
	$("#mcn_backup").datagrid({
		url: rooturl + "html/fileManage/usernamebackup.json",
		toolbar:"#mcn_tb",
		fitColumns: true,
		striped: true,
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageSize:20,
		pageList:[20,40,60],
		columns:[[
			{field:"bptime",title:"备份时间",width:100},
			{field:"bpmode",title:"备份方式",width:100},
			{field:"bpuser",title:"备份人",width:100},
			{field:"bpresult",title:"备份结果",width:100}
		]]
	});

	// 加载权限人名库日志列表
	$("#mcn_log").datagrid({
		url: rooturl + "html/fileManage/usernamelog.json",
		toolbar:"#mcn_ltb",
		fitColumns: true,
		striped: true,
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageSize:20,
		pageList:[20,40,60],
		columns:[[
			{field:"usid",title:"用户ID",width:50},
			{field:"usname",title:"用户名",width:50},
			{field:"optime",title:"操作时间",width:100},
			{field:"address",title:"IP地址",width:100},
			{field:"opmode",title:"操作类型",width:100},
			{field:"opresult",title:"操作结果",width:50},
			{field:"opdescribe",title:"操作描述",width:200}
		]]
	});

	// 加载元数据统计 按分类统计表格
	$("#mco_type").treegrid({
		url:rooturl +"html/fileManage/classTree.json",
		idField:"id",
		treeField: "text",
		fitColumns: true,
		resizeHandle: "both",
		striped: true,
		loadMsg: "请稍后...",
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageNumber: 1,
		pageSize: 20,
		pageList: [20,40,60],
		columns:[[
		    {field:'text',title:'档案树',rowspan:2,width:300},
		    {field:'',title:'电子文件',colspan:2,width:200},
		    {field:'',title:'纸质文件',colspan:2,width:200}
		],[
		    {field:'elecop',title:'份数',width:100},
		    {field:'elebit',title:'容量',width:100},
		    {field:'pepcop',title:'份数',width:100},
		    {field:'peppeg',title:'页数',width:100},

		]]
	});
	
	// 加载元数据统计 按格式统计表格
	var coldata = [[
		{text:"项目",col:2,row:2},
		{text:"1998年前",col:2,row:1},
		{text:"1998-2003",col:2,row:1},
		{text:"2003-2007",col:2,row:1},
		{text:"2007至今",col:2,row:1}
	],[
		{text:"份数",col:1,row:1},
		{text:"容量",col:1,row:1},
		{text:"份数",col:1,row:1},
		{text:"容量",col:1,row:1},
		{text:"份数",col:1,row:1},
		{text:"容量",col:1,row:1},
		{text:"份数",col:1,row:1},
		{text:"容量",col:1,row:1}
	]];
	var rowdata = [
		{text:"文件",col:1,row:7,children:[
			{text:"PDF",col:1,row:1},
			{text:"XLS",col:1,row:1},
			{text:"XLSX",col:1,row:1},
			{text:"TXT",col:1,row:1},
			{text:"DOC",col:1,row:1},
			{text:"DOCX",col:1,row:1},
			{text:"PPT",col:1,row:1}
		]},
		{text:"图片",col:1,row:6,children:[
			{text:"BMP",col:1,row:1},
			{text:"GIF",col:1,row:1},
			{text:"JPG",col:1,row:1},
			{text:"PIC",col:1,row:1},
			{text:"PNG",col:1,row:1},
			{text:"TIF",col:1,row:1}
		]},
		{text:"音视频",col:1,row:10,children:[
			{text:"WAV",col:1,row:1},
			{text:"AIF",col:1,row:1},
			{text:"MP3",col:1,row:1},
			{text:"WMA",col:1,row:1},
			{text:"MMF",col:1,row:1},
			{text:"AVI",col:1,row:1},
			{text:"MPG",col:1,row:1},
			{text:"MOV",col:1,row:1},
			{text:"MP4",col:1,row:1},
			{text:"SWF",col:1,row:1}
		]}
	];
	creategrid("#mcof_grid",coldata,rowdata);

	// 加载元数据统计 按数据库统计
	$("#mco_library").datagrid({
		url: rooturl + "html/fileManage/librarystatdata.json",
		fitColumns: true,
		striped: true,
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageSize:20,
		pageList:[20,40,60],
		columns:[[
			{field:"library",title:"数据库文件",width:100},
			{field:"bit",title:"容量",width:100},
			{field:"source",title:"来源",width:100},
			{field:"remark",title:"备注",width:100}
		]]
	});

	// 绑定元数据备份 按钮点击事件
	$("body").on("click","#mcot_library",function(){
		// 显示弹出框
		$("#frame_progress").window("open");
		// 初始化进度条
		$("#fp_bar").progressbar({
			text:"备份中...{value}%",
			value:0
		});
		// 加载进度条
		clearTimeout(yg_timeout);
		addprogressbar("#fp_bar");
		// 显示备份完成
	});
	$("body").on("click","#mcot_isome",function(){
		$("#mcot_library").trigger("click");
	});

	// 加载资源库备份表格
	$("#mcl_backup").datagrid({
		url: rooturl + "html/fileManage/librydatabackup.json",
		toolbar:"#mcl_tb",
		fitColumns: true,
		striped: true,
		pagination: true,
		rownumbers: true,
		singleSelect: true,
		pageSize:20,
		pageList:[20,40,60],
		columns:[[
			{field:"bptime",title:"备份时间",width:100},
			{field:"bpmode",title:"备份方式",width:100},
			{field:"bpuser",title:"备份人",width:100},
			{field:"bpresult",title:"备份结果",width:100}
		]]
	});

	// 绑定资源库备份 按钮点击事件
	$("body").on("click","#mclt_add",function(){
		$("#mcot_library").trigger("click");
	});
	$("body").on("click","#mclt_all",function(){
		$("#mcot_library").trigger("click");
	});
	
	// 绑定点击弹出窗口事件
	$("#m_content").on("click",".alink",function(){
		// 判定DOC下的数据连接
		if($(this).closest("tr").children("th").html() == "DOC"){
			// 修改数据
			$("#fdi_open").html("office word 2007");
			$("#fdi_server").html("office word 2007");
			$("#fdi_could").html("能");
			$("#fdi_handle").html("无");
		}else{
			// 修改数据
			$("#fdi_open").html("Adobe Reader 11");
			$("#fdi_server").html("Adobe Reader 10");
			$("#fdi_could").html("不能");
			$("#fdi_handle").html("升级Adobe Reader到最新版本");
		}
		$("#frame_details").window("open");
	});
	// 绑定表格数据
	$("#fd_grid").datagrid({
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

	// 绑定刷新按钮事件
		$("body").on("click","#uploadFile_refresh",function(){
			$("#mcd_datagrid").datagrid({
				url:rooturl + "html/fileManage/datagridclick2.json"
			});
		});
	// 绑定点击原文事件
		$("body").on("click",".f_r_b",function(){
			window.open(rooturl + "resource/pdf/12100AR-M.pdf")
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
				]];
		$("#mcd_datagrid").datagrid({
			toolbar: "#mc_tb",
			url: rooturl + "html/fileManage/datagrid.json",
			fitColumns: true,
			columns:datacolumn,
			resizeHandle: "both",
			striped: true,
			loadMsg: "请稍后...",
			pagination: true,
			rownumbers: true,
			pageNumber: 1,
			pageSize: 20,
			pageList: [20,40,60],
			onLoadSuccess:function(data){
				// 自动组卷
				autogroupfile();
			}
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


// 初始化文件列表
function initfilelist(){
	// 清除文件列表
	$(".mcb_list").remove();
	// 初始化面包屑title
	$("#mcl_filebox").panel("header").children(".panel-title").html('<span class="p_title" easyid="">资源库</span>');
	// 加载文件列表
	var treeroot = $("#mta_ltree").tree("getRoots");
	addfilelist(treeroot);
}

// 加载文件列表
function addfilelist(data){
	for(var i=0; i<data.length; i++){
		$("#mco_fimana").append('<li class="mcb_list" easyid="'+data[i].id+'">'
						+'<span class="mcbl_icon mcbl_folder"></span>'
						+'<h3 class="mcbl_name">' + data[i].text + '</h3>'
					+'</li>');
	}
}

function addDate(dadd) {
	var a = new Date()
	a = a.valueOf()
	a = a + dadd * 24 * 60 * 60 * 1000
	a = new Date(a)
	return a;
}


// 加载列表格函数
function coldatagrid(id,data,colnbr){
	// 加载标题行
	$(id).append('<tr></tr>');
	for(var i=0; i<colnbr; i++){
		for(var j=0; j<data.title.length; j++){
			$(id+" tr:last").append('<th>'+ data.title[j] +'</th>');
		}
	}
	// 加载内容
	var mum = 0;
	for(var i=0; i<Math.ceil(data.content.length/colnbr); i++){
		$(id).append('<tr></tr>');
		for(var l=0; l<colnbr; l++){
			// 判定最后一行有空余
			if(data.content.length % colnbr != 0){
				// 判定是最后一行
				if(i == Math.ceil(data.content.length/colnbr)-1){
					// 判定是空余列
					if(l >= (data.content.length % colnbr)){
						// 加载空列
						$(id+" tr:last").append('<th></th>');
						for(var j=0; j<data.content[i].body.length; j++){
							$(id+" tr:last").append('<td></td>');
						}
						// 跳过此次循环
						continue;
					}
				}
			}
			// 加载数据列
			$(id+" tr:last").append('<th>'+ data.content[mum].header +'</th>');
			for(var j=0; j<data.content[mum].body.length; j++){
				$(id+" tr:last").append('<td class="alink">'+ data.content[mum].body[j] +'</td>');
			}
			mum ++;
		}
	}
	// 计算列宽
	var colw = Math.floor(100/(colnbr*(1+data.content[i].body.length)));
	$(id+" tr").css("width",colw+"%");
}

// 生成表格数据
function creategrid(id,col,row){
	// 生成表格
	var mtable = $(id);
	var colnum = 0; //列数
	// 生成列标题
	for(var i=0; i<col.length; i++){
		mtable.append('<tr></tr>');
		for(var j=0; j<col[i].length; j++){
			mtable.find("tr").last().append('<th colspan="'+col[i][j].col
												+'" rowspan="'+col[i][j].row+'">'
												+col[i][j].text+'</th>');
		}
	}
	for(var i=0; i<col[0].length; i++){
		colnum+= col[0][i].col;
	}
	// 生成行标题
	for(var i=0; i<row.length; i++){
		mtable.append('<tr></tr>');
		mtable.find("tr").last().append('<th colspan="'+row[i].col
												+'" rowspan="'+row[i].row+'">'
												+row[i].text+'</th>');
		for(var j=0; j<row[i].children.length; j++){
			if(j != 0){
				mtable.append('<tr></tr>');
			}
			mtable.find("tr").last().append('<th colspan="'+row[i].children[j].col
												+'" rowspan="'+row[i].children[j].row+'">'
												+row[i].children[j].text+'</th>');
			// 加载数据
			for(var k=0; k<colnum-2; k++){
				var filepage = Math.floor(Math.random()*1000);
				var filebit = Math.floor((1+Math.floor(Math.random()*10)/10)*filepage*10)/10 + "G";
				if(k%2 == 0){
					mtable.find("tr").last().append('<td colspan="1" rowspan="1"><a class="alink">'+
													filepage+'</a></td>');
				}else{
					mtable.find("tr").last().append('<td colspan="1" rowspan="1"><a class="alink">'+
													filebit+'</a></td>');
				}
			}
		}
	}
}

// 进度条加载
function addprogressbar(id){
	yg_timeout = setTimeout(function(){
		var pro = $(id).progressbar("getValue");
		if(pro < 100){
			pro += Math.floor(Math.random()*10%3)+1;
			$(id).progressbar("setValue",pro);
			addprogressbar(id);
		}else{
			$(id).progressbar({text:"备份成功！"});
		}
	},200);
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

// 自动组卷
function autogroupfile(){
	// 获取所有行数
	var rownum = $("#mcd_datagrid").datagrid("getRows");
	// 随机5个行号
	var row = [];
	for(var i=0; i<5; i++){
		row.push(Math.floor(Math.random()*100)%(rownum.length-2));
	}
	row.push(rownum.length-1);
	// 排序行号
	row.sort(compareforsort);
	// 选中随机行号和最后一个行号
	for(var i=0; i<row.length; i++){
		// 找到行里的组卷标签
		var zjbutton = $("#mcd_datagrid").datagrid("getPanel")
		.find("tr[datagrid-row-index='"+row[i]+"']")
		.has("td[field='zj']")
		.find(".groupfile");
		// 触发选中行的组卷click事件
		zjbutton.trigger("click");
	}
	// 取消所有选中
	$("#mcd_datagrid").datagrid("unselectAll");

}

function compareforsort(a,b){
	return a - b;
}