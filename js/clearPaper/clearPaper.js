
var bottomheight = 10;            // 预留页面底部高度
var pageminwidth = 1000;          // 页面最小宽度
var pageminheight = 610;          // 页面最小高度
var yg_secondcache = {};          // 二级目录数据缓存
var yg_nowrowid;                  // 当前选中的行id
var groupdata = [];               // 卷组加载数据
var grouprolldata = {};           // 分组后的卷数据

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(function(){
	// 加载时间
	getnowtime("#header_date");
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);
	// 加载树数据
	$("#mtb_tree").tree({
		url: rooturl + "html/clearPaper/rollTree.json"
	});

	// 加载组卷列标题
	$.ajax({
		url: rooturl + "html/clearPaper/groupCol.json",
		type: "POST",
		dataType: "json",
		success:function(data){
			// 加载案卷数据
			$("#mcd_roll").datagrid({
				toolbar:"#mcdr_tb",
				// url: rooturl + "html/fileManage/rolldata.json",
				fitColumns: true,
				columns:data.columns,
				onClickRow:function(index,row){
					// $("#mcd_file").datagrid({
					// 	url: rooturl + "html/fileManage/filedata"+(index%4)+".json"
					// });
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
		},
		error:function(){
			alert("链接服务器失败");
		}
	});
	// 加载卷列标题
	$.ajax({
		url: rooturl + "html/clearPaper/rollCol.json",
		type: "POST",
		dataType: "json",
		success:function(data){
			// 加载文件数据
			$("#mcd_file").datagrid({
				toolbar:"#mcdf_tb",
				columns:data.columns,
				url: rooturl + "html/clearPaper/rollData.json",
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

// 自动组卷函数
function yg_consistroll(){
	// 判定是否选择文件
	var checkroll = $("#mcd_file").datagrid("getChecked");
	if(checkroll.length <= 0){
		alert("请先选择文件");
		return false;
	}
	// 生成组卷
	groupdata = [];
	for(var i=0; i<2; i++){
		var alonedata = {};
		alonedata.ajdh = "G.000.12-000" + (i+1);
		alonedata.ajtm = "惠州炼化二期项目 第"+(i+1)+"卷";
		alonedata.ysh = Math.round(Math.random()*1000);
		alonedata.zfs = Math.round(Math.random()*10)%5+1;
		alonedata.bzdw = "其他部门";
		alonedata.ajqsrq = yg_timenow();
		alonedata.shbz = "待审核";
		alonedata.bgqx = "永久";
		alonedata.hgg = $("#mcdft_ply").combobox("getValue");
		alonedata.bzh = "";
		groupdata.push(alonedata);
	}
	// 刷新数据
	$("#mcd_roll").datagrid("loadData",groupdata);
	// 缓存文件数据
	var radom = Math.round(Math.random()*1000)%(checkroll.length-1);
	grouprolldata[groupdata[0].ajdh] = [];
	grouprolldata[groupdata[1].ajdh] = [];
	for(var i=0; i<checkroll.length; i++){
		if(i<radom){
			grouprolldata[groupdata[0].ajdh].push(checkroll[i]);
		}else{
			grouprolldata[groupdata[1].ajdh].push(checkroll[i]);
		}
	}
	// 绑定组卷点击row事件
	$("#mcd_roll").datagrid({
		onClickRow:function(index,row){
			// 刷新数据
			$("#mcd_file").datagrid("loadData",grouprolldata[row.ajdh]);
			// 隐藏按钮
			$(".groll").css("display","none");
		}
	});

}

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
