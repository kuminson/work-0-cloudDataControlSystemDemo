
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

	// 绑定二级菜单事件
	// for(var i=0; i<$(".mdsn_list").length; i++){
	// 	$(".mdsn_list").eq(i).on("click",function(){
	// 		$(".mdc_secpanel").panel("close");
	// 		$(".mdc_secpanel").eq(i).panel("open");
	// 	});
	// }
	$(".mdsn_list").eq(0).on("click",function(){
		$(".mdc_secpanel").panel("close");
		$("#mdc_treebox").panel("open");
		$(".mdsn_list").removeClass("active");
		$(".mdsn_list").eq(0).addClass("active");
		$(window).triggerHandler("resize");
	});
	$(".mdsn_list").eq(1).on("click",function(){
		$(".mdc_secpanel").panel("close");
		$("#mdc_unitbox").panel("open");
		$(".mdsn_list").removeClass("active");
		$(".mdsn_list").eq(1).addClass("active");
		$(window).triggerHandler("resize");
	});
	$(".mdsn_list").eq(2).on("click",function(){
		$(".mdc_secpanel").panel("close");
		$("#mdc_rolebox").panel("open");
		$(".mdsn_list").removeClass("active");
		$(".mdsn_list").eq(2).addClass("active");
		$(window).triggerHandler("resize");
	});

	// 加载档案树表格
	$("#mdc_tree").treegrid({
		method: "get",
		url:rooturl +"html/system/rollTree.json",
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
		    {field:'text',title:'节点名称',width:200},
		    {field:'node',title:'节点代码',width:100},
		    {field:'nodep',title:'父节点',width:100},
		    {field:'nodeodr',title:'节点排序',width:100}
		]]
	});

	// 加载组织机构树
	$("#mdcu_tree").tree({
		method: "get",
		url:rooturl +"html/system/unit.json",
		onClick: function(node){
			console.log(node);
			if(node.children == undefined){
				$("#mdcu_grid").datagrid({
					method: "get",
					url:rooturl + "html/system/user.json",
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
					    {field:'login',title:'登录名',width:100},
					    {field:'name',title:'姓名',width:100},
					    {field:'sex',title:'性别',width:100},
					    {field:'userid',title:'身份证号',width:100},
					    {field:'phone',title:'电话号码',width:100},
					    {field:'identify',title:'用户标识',width:100},
					    {field:'unit',title:'组织机构',width:100},
					    {field:'remark',title:'备注',width:100}
					]],
					onLoadSuccess:function(data){
						$(".datagrid_unit").html(node.text);
						for(var i=0; i<Math.floor(Math.random()*10%data.rows.length); i++){
							$("#mdcu_grid").datagrid("deleteRow",1);
						}
					}
				});
			}
		}
	});

	// 加载角色树
	$("#mdcr_role").tree({
		method: "get",
		url: rooturl + "html/system/role.json"
	});
	// 加载模块权限treegrid
	$("#mdcr_mode").treegrid({
		method: "get",
		url:rooturl +"html/system/modetreegrid.json",
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
		checkbox: true,
		columns:[[
		    {field:'text',title:'按钮名',width:200},
		    {field:'btnid',title:'按钮ID',width:100},
		    {field:'order',title:'按钮排序',width:100},
		    {field:'address',title:'html名称',width:200}
		]]
	});
	// 加载数据权限treegrid
	$("#mdcr_data").treegrid({
		method: "get",
		url:rooturl +"html/system/rollTree.json",
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
		checkbox: true,
		columns:[[
		    {field:'text',title:'按钮名',width:200},
		    {field:'ope',title:'操作类型',width:100}
		]],
		// onLoadSuccess:function(){
		// 	$(".treegrid_ope").html("文件查看");
		// }
		onClickCell:function(field,row){
			console.log(row);
			// 判定行是选中状态
			if(row.checkState == "checked"){
				// 判定该行没有多选框
				var newtext = row[field];
				var conbox =$("tr[node-id='"+row.id+"']").children("td[field='"+field+"']").children(".datagrid-cell");
				if(conbox.attr("yg_iscom") == undefined){
					// 判定其他行有多选框
					if($(".datagrid-cell[yg_iscom]").attr("yg_iscom") == undefined){
						// 没有不操作
					}else{
						// 删除多选框并缓存数据
						$(".datagrid-cell[yg_iscom]").html($("#mdcr_combo").combobox("getValue"));
						// 清除标记
						$(".datagrid-cell[yg_iscom]").removeAttr("yg_iscom");
					}
					// 添加标记
					conbox.attr("yg_iscom","1");
					// 添加多选框
					$("tr[node-id='"+row.id+"']").children("td[field='"+field+"']").children(".datagrid-cell").html('<input id="mdcr_combo" name="perm" value="'+newtext+'" style="width:100%;">')
					$("#mdcr_combo").combobox({
						valueField:"val",
						textField:"text",
						data:[
							{
								val:"文件查看",
								text:"文件查看"
							},{
								val:"文件管理",
								text:"文件管理"
							}
						]
					});
				}
			}else{
				alert("请先勾选该行！");
			}
		}
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
