
var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 加载时间
	getnowtime("#header_date");
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);
	// 加载树数据
	$("#mtb_tree").tree({
		url: rooturl + "html/library/rollTree.json",
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
					url: rooturl + "html/library/filedata1.json",
					type: "POST",
					dataType: "json",
					success:function(data){
						for(var i=0; i<data.rows.length; i++){
							$("#mc_box").append('<li class="mcb_list">'
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
			$("#m_content").panel("header").children(".panel-title").html('<span class="p_title" easyid="">资源库</span>');
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
		}
	});

	// 绑定双击文件夹进入事件
	$("#mc_box").on("dblclick",".mcb_list",function(e){
		if($(this).attr("easyid") != undefined){
			var treenode = $("#mtb_tree").tree("find",$(this).attr("easyid"));
			// 触发点击事件
			$(treenode.target).trigger("click");
			// 收敛所有树结构
			$("#mtb_tree").tree("collapseAll");
			// 展开点击树结构
			$("#mtb_tree").tree("expandTo",treenode.target);
		}
	});

	// 绑定单击文件列表 触发选中状态
	$("#mc_box").on("click",".mcb_list",function(e){
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
				$("#mtb_tree").tree("collapseAll");
			}else{
				var treenode = $("#mtb_tree").tree("find",easyid);
				// 触发点击事件
				$(treenode.target).trigger("click");
				// 收敛所有树结构
				$("#mtb_tree").tree("collapseAll");
				// 展开点击树结构
				$("#mtb_tree").tree("expandTo",treenode.target);
			}
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


});

// 初始化文件列表
function initfilelist(){
	// 清除文件列表
	$(".mcb_list").remove();
	// 初始化面包屑title
	$("#m_content").panel("header").children(".panel-title").html('<span class="p_title" easyid="">资源库</span>');
	// 加载文件列表
	var treeroot = $("#mtb_tree").tree("getRoots");
	addfilelist(treeroot);
}

// 加载文件列表
function addfilelist(data){
	for(var i=0; i<data.length; i++){
		$("#mc_box").append('<li class="mcb_list" easyid="'+data[i].id+'">'
						+'<span class="mcbl_icon mcbl_folder"></span>'
						+'<h3 class="mcbl_name">' + data[i].text + '</h3>'
					+'</li>');
	}
}