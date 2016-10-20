
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
	$("#mta_otree").tree({
		method: "get",
		url: rooturl + "html/fileManage/rollTree.json"
	});
	$("#mta_ltree").tree({
		method: "get",
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
					type: "GET",
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
				method: "get",
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
				"title":"文件题名",
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
				// 加载area表格
				addhighchart();
				// 加载gauges表格
				addgaugesleft();
				addgaugesright();
				// 加载bar表格
				addhighchartbar();
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
		method: "get",
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
		method: "get",
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
		method: "get",
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

// 加载area表格
function addhighchart(){
	var now = addDate(-60);
	var year = now.getFullYear();
	var month = now.getMonth();
	var date = now.getDate();
	$("#mcob_area").highcharts({
		chart: {
            type: 'area'
        },
        credits: {
            enabled: false
        },
        title: {
            text: '<p style="font-size:12px;font-family: \'微软雅黑\'">注册用户及浏览量统计曲线</p>'
        },
        subtitle: {
            text: null
        },
        xAxis: {
            type: 'datetime',
            labels: {
                step: 1,
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m-%d', this.value);
                }
            }
        },
        yAxis: {
            title: {
                text: null
            },
            tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] // 指定竖轴坐标点的值
        },
        tooltip: {
            pointFormat: '{series.name} 为 <b>{point.y:,.0f}</b>'
        },
        plotOptions: {
            area: {
                pointStart: Date.UTC(year, month, date),
                pointInterval: 24 * 3600 * 1000, // one day
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: '访问量*100',
            data: [0, 0, 0,
                0, 1, 1, 1.20, 1.50, 2.00, 4.26, 6.60, 8.69, 10.60, 14.05, 14.71, 13.22,
                12.38, 12.21, 11.29, 10.89, 13.39, 13.99, 12.38, 13.43, 13.92, 14.78,
                16.15, 17.85, 19.55, 21.05, 22.44, 23.93, 23.35, 23.62, 24.49,
                23.52, 25.84, 27.31, 31.97, 32.10, 30.67, 30.99, 32.11, 32.20,
                33.10, 33.45, 32.99, 31.90, 32.30, 33.12, 34.45, 33.68, 34.09,
                33.90, 33.12, 74.55, 85.78, 86.19, 97.20, 98.10]
        }, {
            name: '总注册量',
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,
            1,2,1,0,0,0,0,1,0,0,0,1,0,1,2,0,1,0,0,0,1,0,
            0,0,0,0,0,0,0,0,0,0,1,0,2,0,0,2,0,0,0,0,0,0]
        }]
	});
}

// 加载bar表格
function addhighchartbar(){
	$("#mcos_bar").highcharts({
		chart: {
	        type: 'bar'
	    },
	    title: {
	        text: null
	    },
	    xAxis: {
	        categories: ['猪产品', '牛产品', '羊产品', '鸡产品']
	    },
	    yAxis: {
	        min: 0,
	        title: {
	            text: null
	        }
	    },
	    tooltip: {
	        valueSuffix: ' 吨'
	    },
	    legend: {
	        enabled: false
	    },
	    credits: {
	        enabled: false
	    },
	    plotOptions: {
	        bar: {
	            dataLabels: {
	                enabled: true
	            }
	        },
	        series: {
	            stacking: 'normal'
	        }
	    },
	    series: [{
	        name: '库存量',
	        data: [571321,269822,164415,19645]
	    }]
	});
}

// 加载gauges left 表格
function addgaugesleft(){
	$("#mcob_fufure").highcharts({
		chart:{
			type:"solidgauge"
		},
		title:{
			text:"文档收集",
			y:200,
			margin:-40
		},
		pane:{
			startAngle: 0,
			endAngle: 360,
			background:{
				backgroundColor:"#EFEFEF",
				innerRadius: 0,
				outerRadius: "100%",
				shape:"arc",
				borderWidth:0
			}
		},
		tooltip:{
			enabled: false
		},
		yAxis:{
			stops:[
				[0.1,"#0FE4AA"]
			],
			min:0,
			max:100,
			title:{
				text:"期货成交量",
				y: 110
			},
			tickAmount:0,
			tickPositions: []
		},
		credits:{
			enabled:false
		},
		plotOptions:{
			solidgauge:{
				dataLabels:{
					y: -12,
					borderWidth:0,

				}
			}
		},
		series:[{
			data:[{
				y:7,
				radius: '100%',
				innerRadius: '80%'
			}],
			useHTML:true,
			dataLabels:{
				format:'<div style="text-align:center"><span style="font-size:24px;color:#5E5E5E'
						+ '">{point.y}%</span>'
						+'</div>'
			}
		}]
	});
}

// 加载gauges right 表格
function addgaugesright(){
	$("#mcob_cash").highcharts({
		chart:{
			type:"solidgauge"
		},
		title:{
			text:"错误率",
			y:200,
			margin:-40
		},
		pane:{
			startAngle: 0,
			endAngle: 360,
			background:{
				backgroundColor:"#EFEFEF",
				innerRadius: 0,
				outerRadius: "100%",
				shape:"arc",
				borderWidth:0
			}
		},
		tooltip:{
			enabled: false
		},
		yAxis:{
			stops:[
				[0.1,"#60A9DD"]
			],
			min:0,
			max:100,
			title:{
				text:"现货成交量",
				y:110
			},
			tickAmount:0,
			tickPositions: []
		},
		credits:{
			enabled:false
		},
		plotOptions:{
			solidgauge:{
				dataLabels:{
					y: -12,
					borderWidth:0,

				}
			}
		},
		series:[{
			data:[{
				y:93,
				radius: '100%',
				innerRadius: '80%'
			}],
			useHTML:true,
			dataLabels:{
				format:'<div style="text-align:center"><span style="font-size:24px;color:#5E5E5E'
						+ '">{point.y}%</span>'
						+'</div>'
			}
		}]
	});
}