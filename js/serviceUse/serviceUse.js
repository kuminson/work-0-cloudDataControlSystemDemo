
var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 加载时间
	getnowtime("#header_date");
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);

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

	// 加载专题树
	$("#mtb_tree").tree({
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
					type: "POST",
					dataType: "json",
					success:function(data){
						for(var i=0; i<data.rows.length; i++){
							$("#dcf_files").append('<li class="mcb_list">'
											+'<span class="mcbl_icon mcbl_file"></span>'
											+'<h3 class="mcbl_name">' + data.rows[i].filename + '</h3>'
										+'</li>');
						}
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

	// 绑定需求预案按钮事件
	$("#mcdrt_need").on("click",function(){
		$("#o_frame").window("open");
	});

	// 绑定需求预案制作专题按钮
	$("body").on("click","#off_submit",function(){
		$("#mcdrt_add").triggerHandler("click");
	});

	// 加载组织机构树
	$(".mt_unit").tree({
		url:rooturl + "html/serviceUse/unit.json",
		checkbox: true
	});

	// 绑定选择按钮事件
	$("body").on("click","#mcgb_select",function(){
		var seldata = $("#fcg_grid").datagrid("getChecked");
		// 判断选择是否为空
		if(seldata.length == 0){
			alert("请至少选择一条数据");
			return 0;
		}
		// 加载文件数据
		for(var i=0; i<seldata.length; i++){
			$("#dcf_files").append('<li class="mcb_list" easyid="'+seldata[i].wjbh+'">'
							+'<span class="mcbl_icon mcbl_file"></span>'
							+'<h3 class="mcbl_name">' + seldata[i].wjmc + '</h3>'
						+'</li>');
		}
		// 关闭悬浮框
		$("#frame").window("close");
	});

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
			url:rooturl + "html/serviceUse/rollTree.json",
			onClick: function(){
				// 加载卷列标题
				$.ajax({
					url: rooturl + "html/serviceUse/rollCol.json",
					type: "POST",
					dataType: "json",
					success:function(data){
						// 加载文件数据
						$("#fcg_grid").datagrid({
							columns:data.columns,
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