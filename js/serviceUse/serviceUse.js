
var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度
var filedata1;                    // filedata1.json 数据缓存
var dragcache;                    // 拖拽缓存

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
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
		$("#dcf_databox").height($("#dc_files").height() - 28 -1 + "px");
	});
	$(window).triggerHandler("resize");

	// 加载专题树
	$("#mtb_tree").tree({
		method: "get",
		url: rooturl + "html/serviceUse/subjectTree.json",
		onLoadSuccess: function(){
			// 初始化文件列表
			initfilelist();
		},
		onClick: function(node){
			// 加载文件列表
			if(node.children == undefined){
				// 显示属性栏
				$("#datagrid_content").layout("expand","east");
				// 属性栏内容加载
				$("#mtfi_title").val(node.text);
				if(Math.round(Math.random()*10)%2 == 0){
					$("#mtfi_common").prop("checked",true);
					$("#mt_box").layout("collapse","south");
				}else{
					$("#mtfi_person").prop("checked",true);
					$("#mt_box").layout("expand","south");
				}
				$("#mtfi_name").val("系统管理员");
				$("#mtfi_time").val(yg_timenow());
				$("#mtfi_start").datebox("setValue",yg_timenow());
				$("#mtfi_over").datebox("setValue","01/01/2017");
				// 文件处于选中状态
				for(var i=0; i<$(".mcb_list").length; i++){
					if($(".mcb_list").eq(i).attr("easyid") == node.id){
						$(".mcb_list").eq(i).addClass("active");
					}
				}
			}else{
				// 清除列表
				$(".mcb_list").remove();
				// 加载文件列表
				addfilelist(node.children);
			}
			// 初始化面包屑title
			$("#m_content").panel("header").children(".panel-title").html('<span class="p_title" easyid="">专题文件</span>');
			// 加载面包屑title
			var titlenames = [];
			var titleid = [];
			var parentnode = $("#mtb_tree").tree("getParent",node.target);
			titlenames.push(node.text);
			while(parentnode != null){
				titlenames.push(parentnode.text);
				titleid.push(parentnode.id);
				parentnode = $("#mtb_tree").tree("getParent",parentnode.target);
			}
			var titlenamenbr = titlenames.length;
			for(var i=0; i<titlenamenbr; i++){
				var paneltitle = $("#m_content").panel("header").children(".panel-title");
				paneltitle.html(paneltitle.html() +'<span class="p_title" easyid="'+titleid.pop()+'">&gt;'+titlenames.pop()+'</span>');
			}
			// 展开树结构
			$("#mtb_tree").tree("expandTo",node.target);
			$("#mtb_tree").tree("expand",node.target);
		}
	});

	// 绑定双击文件夹进入事件
	$("#mcd_files").on("dblclick",".mcb_list",function(e){
		if($(this).attr("easyid") != undefined){
			var treenode = $("#mtb_tree").tree("find",$(this).attr("easyid"));
			// 判定是否是叶子节点
			if(treenode.children == undefined){
				// 弹出窗口
				$("#detailswin").window("open");
				// 加载文件列表
				$.ajax({
					url: rooturl + "html/serviceUse/filedata1.json",
					type: "GET",
					dataType: "json",
					success:function(data){
						// 清除文件
						$("#dcf_files .mcb_list").remove();
						// 加载文件
						addfiledetails(data,"");
						// 缓存数据
						filedata1 = data;
						// 在标题处初始化面包屑
						$("#d_content").layout("panel","center")
										.panel("header")
										.children(".panel-title")
										.html('<span class="p_title" pstion="">专题</span>');

					},
					error:function(){
						alert("服务器链接失败！")
					}
				});
				// 复制属性数据
				setframeattr({
					title: $("#mtfi_title").val(),
					common: $("#mtfi_common").prop("checked"),
					person: $("#mtfi_person").prop("checked"),
					name: $("#mtfi_name").val(),
					time: $("#mtfi_time").val(),
					start: $("#mtfi_start").datebox("getValue"),
					over: "1/1/2017"
				});
			}else{
				// 触发点击事件
				$(treenode.target).trigger("click");
				// 收敛所有树结构
				$("#mtb_tree").tree("collapseAll");
				// 展开树结构
				$("#mtb_tree").tree("expandTo",treenode.target);
				$("#mtb_tree").tree("expand",treenode.target);
			}
		}
	});

	// 绑定双击文件夹进入事件
	$("#dcf_files").on("dblclick",".mcb_list",function(){
		// 判定是文件夹
		if($(this).attr("pstion") != ""){
			// 获取位置
			var pstion = $(this).attr("pstion");
			// 清除列表
			$("#dcf_files .mcb_list").remove();
			// 加载文件
			addfiledetails(filedata1,pstion);
			// 在标题处添加面包屑
			addcrumbstodetails(filedata1,pstion);
		}
	});

	// 绑定点击penal title跳转事件
	$("#datagrid_content").on("click",".p_title",function(){
		var easyid = $(this).attr("easyid");
		if(easyid != "undefined"){
			if(easyid == ""){
				// 初始化文件列表
				initfilelist();
				// 收敛所有树结构
				$("#mtb_tree").tree("collapseAll");
			}else{
				var treenode = $("#mtb_tree").tree("find",easyid);
				// 触发点击事件
				$(treenode.target).trigger("click");
				// 收敛所有树结构
				$("#mtb_tree").tree("collapseAll");
				// 展开树结构
				$("#mtb_tree").tree("expandTo",treenode.target);
				$("#mtb_tree").tree("expand",treenode.target);
			}
		}
	});

	// 绑定点击详情窗口penal title跳转事件
	$("#detailswin").on("click",".p_title",function(){
		// 获取位置
		var pstion = $(this).attr("pstion");
		// 清除列表
		$("#dcf_files .mcb_list").remove();
		// 加载列表
		addfiledetails(filedata1,pstion);
		// 清除之后面包屑
		$(this).nextAll().remove();
	});

	// 绑定单击文件列表 触发选中状态
	$("#mc_box").on("click",".mcb_list",function(e){
		$(".mcb_list").removeClass("active");
		$(this).addClass("active");
		if($(this).attr("easyid") != undefined){
			var treenode = $("#mtb_tree").tree("find",$(this).attr("easyid"));
			if(treenode.children == undefined){
				// 触发点击事件
				$(treenode.target).trigger("click");
			}
		}
	});
	// 绑定单击文件列表 触发选中状态
	$("#dcf_files").on("click",".mcb_list",function(e){
		$("#dcf_files .mcb_list").removeClass("active");
		$(this).addClass("active");
	});

	// 绑定制作专题事件
	$("#mcdrt_add").on("click",function(){
		// 弹出窗口
		$("#detailswin").window("open");
		// 清空文件列表
		$("#dcf_files .mcb_list").remove();
		// 隐藏表格列表
		$("#dcf_databox").addClass('hide');
		// 清空属性
		setframeattr({
			title: "新建专题",
			common: true,
			person: false,
			name: $("#mtfi_name").val(),
			time: $("#mtfi_time").val(),
			start: "",
			over: ""
		});
	});

	// 绑定非表格点击事件
	$("body").on("click",function(e){
		if($(e.target).closest("#mcdrt_need").length == 0){
			if(!($("#l_frame").hasClass("hide"))){
				$("#l_frame").addClass("hide");
			}
		}
	});

	// 绑定需求预案按钮点击事件
	$("#mcdrt_need").on("click",function(){
		if($("#l_frame").hasClass("hide")){
			$("#l_frame").removeClass("hide");
			$("#l_frame").css("top",$(this).offset().top + 26 + "px")
						 .css("left",$(this).offset().left + "px");
			$(window).triggerHandler("resize");
		}else{
			$("#l_frame").addClass("hide");
		}
	});


	// 加载datagrid数据
	$("#lf_grid").datagrid({
		columns:[[
			{
				field:"name",
				title:"姓名",
				width:100
			},{
				field:"obj",
				title:"项目",
				width:100
			},{
				field:"time",
				title:"时间",
				width:100
			}
		]],
		data:[
			{
				name:"王明翠" ,
				use:1,
				obj:"数据加工需求预案",
				mode:1,
				describe:"按数据加工需要，需海港吊装装置施工、监理文件一套，望推送。",
				time:"2016-10-22"
			},{
				name:"刘紫嫣" ,
				use:1,
				obj:"ERP成本数据需求预案",
				mode:1,
				describe:"需2005年至2010年，成本中心数据一套。",
				time:"2016-10-18"
			},{
				name:"于虎飞" ,
				use:1,
				obj:"ERP权限人名库需求预案",
				mode:1,
				describe:"需ERP权限人名表中，徐亮在2010年9月份至2012年12月份，操作记录一份。",
				time:"2016-10-11"
			},{
				name:"孟彩丽" ,
				use:1,
				obj:"CDAS操作日志审计需求预案",
				mode:1,
				describe:"需CDAS操作系统中，王磊在2013年1月份至2014年9月份，操作记录一份。用于审计。",
				time:"2016-10-07"
			},{
				name:"冯子明" ,
				use:1,
				obj:"数据追加需求预案",
				mode:0,
				describe:"",
				time:"2016-10-04"
			}
		],
		fitColumns: true,
		resizeHandle: "both",
		striped: true,
		loadMsg: "请稍后...",
		singleSelect:true,
		onClickRow:function(index,row){
			if(row.mode == 1){
				$("#o_frame").window("open");
				$("#l_frame").addClass("hide");
				$("#offli_user").textbox("setText",row.name);
				$("#offli_text").textbox("setText",row.describe);
				$("input[name='offri_use']").eq(row.use).prop("checked","true");
			}
		}
	});

	// 绑定需求预案制作专题按钮
	$("body").on("click","#off_submit",function(){
		$("#mcdrt_add").triggerHandler("click");
	});

	// 加载组织机构树
	$(".mt_unit").tree({
		method: "get",
		url:rooturl + "html/serviceUse/unit.json",
		checkbox: true
	});

	// 绑定选择按钮事件
	selectbutton("#mcgb_select","#fcg_grid","wjbh","wjmc");

	// 绑定保存按钮事件
	$("#d_content").on("click","#mcdrt_save",function(){
		// 判定专题名称是否为空
		if($("#dafi_title").val() == ""){
			// 弹出警告
			alert("专题名称不能为空");
		}else{
			// 关闭弹出框
			$("#detailswin").window("close");
			// 生成新文件夹
			addfilelist([{id:"new001",text:$("#dafi_title").val()}]);
			// 新建文件选中效果
			$(".mcb_list").removeClass("active");
			$(".mcb_list[easyid='new001']").addClass("active");
		}
	});

	// 绑定点击文件
	$("#m_content").on("click",".mcbl_file",function(){
		// 显示配置流程事件
		$("#mc_box").layout("expand","south");
	});

	// 发布类型改变时触发事件
	radiochange({
		name:'[name="subject"]',
		indiv:"#mtfi_common",
		layout:"#mt_box"
	});
	radiochange({
		name:'[name="asubject"]',
		indiv:"#dafi_common",
		layout:"#d_attr"
	});

	// 设置datebox参数
	$("#mtfi_start").datebox({
		currentText: "今天",
		closeText: "关闭"
	});
	$("#mtfi_over").datebox({
		currentText: "今天",
		closeText: "关闭"
	});

	// 绑定选择专题文件事件
	$("#dc_files").on("click","#mcdrt_ok",function(){
		// 显示悬浮窗
		$("#frame").window("open");
		// 加载树
		$("#fct_tree").tree({
		method: "get",
			url:rooturl + "html/serviceUse/rollTree.json",
			onClick: function(){
				// 加载卷列标题
				$.ajax({
					url: rooturl + "html/serviceUse/rollCol.json",
					type: "GET",
					dataType: "json",
					success:function(data){
						// 加载文件数据
						$("#fcg_grid").datagrid({
							columns:data.columns,
		method: "get",
							url: rooturl + "html/serviceUse/rollData.json",
							fitColumns: true,
							resizeHandle: "both",
							striped: true,
							loadMsg: "请稍后...",
							pagination: true,
							rownumbers: true,
							pageNumber: 1,
							pageSize: 20,
							pageList: [20,40,60]
						});
					},
					error:function(){
						alert("链接服务器失败");
					}
				});
			}
		});
	});

	// 加载业务系统数据 树
	$("#fbt_tree").tree({
		method: "get",
		url: rooturl + "html/serviceUse/busnessTree.json",
		onClick:function(node){
			// 加载表格数据
			$.ajax({
				url: rooturl + "html/serviceUse/busnessdatacol.json",
				type: "GET",
				dataType: "json",
				success:function(data){
					$("#fbg_grid").datagrid({
		method: "get",
						url: rooturl + "html/serviceUse/busnessdata.json",
						fitColumns: true,
						striped: true,
						pagination: true,
						rownumbers: true,
						pageSize:20,
						pageList:[20,40,60],
						columns:data.columns
					});

				},
				error:function(){
					alert("服务器链接失败！");
				}
			});
		}
	});

	// 绑定业务数据选择按钮事件
	// selectbutton("#fbgt_select","#fbg_grid","center","name");
	selectbuttontogrid("#fbgt_select","#fbg_grid","html/serviceUse/busnessdatacol.json");

	// 加载权限人名库 datagrid数据
	$.ajax({
		url: rooturl + "html/serviceUse/usernamelogcol.json",
		type: "GET",
		dataType: "json",
		success:function(data){
			$("#f_permname").datagrid({
		method: "get",
				url: rooturl + "html/serviceUse/usernamelog.json",
				toolbar:"#fp_tb",
				fitColumns: true,
				striped: true,
				pagination: true,
				rownumbers: true,
				pageSize:20,
				pageList:[20,40,60],
				columns:data.columns
			});

		},
		error:function(){
			alert("服务器链接失败！");
		}
	});
	
	// 绑定权限人名 选择按钮事件
	// selectbutton("#fpt_select","#f_permname","usid","usname");
	selectbuttontogrid("#fpt_select","#f_permname","html/serviceUse/usernamelogcol.json");

	// 绑定权限人名 搜索按钮事件
	$("#fpt_search").searchbox({
		searcher:function(val,name){
			$("#f_permname").datagrid({
		method: "get",
				url: rooturl + "html/serviceUse/userwangleilog.json"
			});
		}
	});

	// 拖拽开始事件
	$("#dcf_files").on("dragstart",".mcb_list",function(e){
		// 获取位置
		dragcache = $(this).attr("findex");
	});
	// 拖拽进入事件
	$("#dcf_files").on("dragover",".mcb_list",function(e){
		console.log("dragover");
		// 判定是文件夹
		if($(this).attr("pstion") != ""){
			// 添加外边框高亮样式
			$(this).addClass("dragenter");
		}
		// 取消默认操作
		e.preventDefault();
	});
	// 拖拽离开事件
	$("#dcf_files").on("dragleave",".mcb_list",function(e){
		console.log("dragleave");
		// 判定是文件夹
		if($(this).attr("pstion") != ""){
			// 移除外边框高亮样式
			$(this).removeClass("dragenter");
		}
	});
	// 拖拽结束事件
	$("#dcf_files").on("drop",".mcb_list",function(e){
		console.log("drop");
		// 判定是文件夹
		if($(this).attr("pstion") != ""){
			// 移除外边框高亮样式
			$(this).removeClass("dragenter");
			// 修改缓存的filedata1
			// 获取文件夹位置
			var pstion = $(this).attr("pstion");
			// 获取当前页面位置
			var filepstion = pstion.match(/^\.(.*)(?=\[)/);
			// 获取文件夹index
			// var fileindex = pstion.match(/\[(.*?)\]$/);
			// 取出文件
			var file = filedata1[filepstion[1]].splice(dragcache,1);
			// 插入文件
			// eval("filedata1"+pstion+".children");
			console.log(file);
			console.log(eval("filedata1"+pstion+".children.push(file[0])"));
			// 刷新页面 触发面包屑最后一个点击事件
			$("#d_content").layout("panel","center")
							.panel("header")
							.children(".panel-title")
							.children()
							.last()
							.trigger("click");
		}
		// 取消默认操作
		e.preventDefault();
	});
});

// 当前日期
function yg_timenow(){
	var timedate = {};
	timedate.now = new Date;
	timedate.year = timedate.now.getFullYear();
	timedate.month = timedate.now.getMonth()+1;
	timedate.date = timedate.now.getDate();
	var timenow = timedate.year + "-" + timedate.month + "-" + timedate.date;
	return timenow;
}

// 初始化文件列表
function initfilelist(){
	// 清除文件列表
	$(".mcb_list").remove();
	// 初始化面包屑title
	$("#m_content").panel("header").children(".panel-title").html('<span class="p_title" easyid="">专题文件</span>');
	// 加载文件列表
	var treeroot = $("#mtb_tree").tree("getRoots");
	addfilelist(treeroot);
}

// 加载文件列表
function addfilelist(data){
	for(var i=0; i<data.length; i++){
		$("#mcd_files").append('<li class="mcb_list" easyid="'+data[i].id+'">'
						+'<span class="mcbl_icon mcbl_folder"></span>'
						+'<h3 class="mcbl_name">' + data[i].text + '</h3>'
					+'</li>');
	}
}

// 修改日期格式
$.fn.datebox.defaults.formatter = function(date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+m+'-'+d;
}

// 单选改变事件绑定
function radiochange(obj){
	$(obj.name).change(function(){
		if($(obj.indiv).prop("checked") === true){
			$(obj.layout).layout("collapse","south");
		}else{
			$(obj.layout).layout("expand","south");
		}
	});
}

// 设置弹出框属性值
function setframeattr(obj){
	$("#dafi_title").val(obj.title);
	$("#dafi_common").prop("checked",obj.common)
	$("#dafi_person").prop("checked",obj.person)
	if($("#dafi_common").prop("checked") == true){
		$("#d_attr").layout("collapse","south");
	}else{
		$("#d_attr").layout("expand","south");
	}
	$("#dafi_name").val(obj.name);
	$("#dafi_time").val(obj.time);
	$("#dafi_start").datebox("setValue",obj.start);
	$("#dafi_over").datebox("setValue",obj.over);
}

// 绑定选择按钮显示文件事件
function selectbutton(btn,grid,kid,kname){
	$("body").on("click",btn,function(){
		var seldata = $(grid).datagrid("getChecked");
		// 判断选择是否为空
		if(seldata.length == 0){
			alert("请至少选择一条数据");
			return 0;
		}
		// 加载文件数据
		for(var i=0; i<seldata.length; i++){
			$("#dcf_files").append('<li class="mcb_list" easyid="'+seldata[i][kid]+'">'
							+'<span class="mcbl_icon mcbl_file"></span>'
							+'<h3 class="mcbl_name">' + seldata[i][kname] + '</h3>'
						+'</li>');
		}
		// 关闭悬浮框
		$("#frame").window("close");
	});
}

// 绑定选择按钮显示表格事件
function selectbuttontogrid(btn,grid,col){
	$("body").on("click",btn,function(){
		var seldata = $(grid).datagrid("getChecked");
		// 判断选择是否为空
		if(seldata.length == 0){
			alert("请至少选择一条数据");
			return 0;
		}
		// 清除文件数据
		$("#dcf_files .mcb_list").remove();
		// 显示表格
		$("#dcf_databox").removeClass('hide');
		$("#dcf_databox").triggerHandler("resize");

		// 加载表格数据
		$.ajax({
			url: rooturl + col,
			type: "GET",
			dataType: "json",
			success:function(col){
				$("#dcf_datagrid").datagrid({
					fitColumns: true,
					striped: true,
					pagination: true,
					rownumbers: true,
					pageSize:20,
					pageList:[20,40,60],
					columns:col.columns
				});
				$("#dcf_datagrid").datagrid("loadData",seldata);

			},
			error:function(){
				alert("服务器链接失败！");
			}
		});
		// 触发resize调整尺寸
		// $(window).triggerHandler("resize");
		// 点开专题详情时 清空文件数据和表格数据
		// 关闭悬浮框
		$("#frame").window("close");
	});
}

// 加载专题详情文件
function addfiledetails(data,pstion){
	// 确定加载数据位置
	var list = eval('data'+pstion+".children");
	for(var i=0; i<list.length; i++){
		// 判断是文件夹
		var pst; //位置
		var fclass; //class类别
		if(list[i].filekind == "folder"){
			pst = pstion +".children" + "[" + i + "]";
			fclass = "mcbl_folder2";
		// 判断是文件
		}else{
			pst = "";
			fclass = "mcbl_file";
		}
		var tab = '<li class="mcb_list" pstion="'+pst+'" draggable="true" findex="'+i+'">'
						+'<span class="mcbl_icon '+fclass+'"></span>'
						+'<h3 class="mcbl_name">' + list[i].filename + '</h3>'
					+'</li>'
		$("#dcf_files").append(tab);
	}
}

// 在专题标题上加面包屑
function addcrumbstodetails(data,pstion){
	// 获取标题元素
	var title = $("#d_content").layout("panel","center").panel("header").children(".panel-title");
	// 添加面包屑
	var tab = '<span class="p_title" pstion="'+ pstion +'">&nbsp;&gt;'
				+ eval("data"+pstion+".filename").slice(0,5)
			+'...</span>';
	title.append(tab);
}