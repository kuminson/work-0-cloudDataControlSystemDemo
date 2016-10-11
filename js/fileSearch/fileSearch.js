// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
		$("#mc_filebox").css("height",$(".main").height()-$(".panel-header")[0].offsetHeight - $(".mc_box").height() -1 + "px");
		$("#mc_dataindex").css("height",$(".main").height() - $(".panel-header")[0].offsetHeight - $(".mc_box").height() -1 + "px");
	});
	$(window).triggerHandler("resize");

	// 加载正文数据
	$.ajax({
		url: rooturl + "html/fileSearch/filedata.json",
		type: "POST",
		dataType: 'json',
		success:function(data){
			var datas = data.datas;
			for(var i=0; i<datas.length; i++){
				$("#mcf_result").append('<li class="mcfr_list">'
											+'<a href="#" class="mcfr_title">'+ datas[i].title +'</a>'
											+'<p class="mcfr_content">' + datas[i].content + '</p>'
											+'<span class="mcfr_info">[详细目录信息]</span>'
											+'<strong class="weight">编制单位：</strong>'
											+'<strong class="weight">文件时间：' + datas[i].fileTimeShow.slice(0,10) + '</strong>'
											+'</li>');
			}
		},
		error:function(){
			alert("链接服务器失败");
		}
	});

	
	
	// $("#mc_dataindex").css("display","none");

	// 绑定单选事件
	$(".mcs_rabox").change(function(e) {
		if($(e.target).attr("id") == "mcsr_index"){
			$("#mc_filebox").css("display","none");
			$("#mc_dataindex").css("display","block");
			$("#mt_boxfile").css("display","none");
			$("#mt_boxindex").css("display","block");
			// 加载表格列标题
			$.ajax({
				url: rooturl + "html/fileSearch/coldata.json",
				type: "POST",
				dataType: 'json',
				success:function(data){
					// 加载表格数据
					$("#mcd_datagrid").datagrid({
						url: rooturl + "html/fileSearch/griddata.json",
						columns: data.columns,
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
		}else if($(e.target).attr("id") == "mcsr_text"){
			$("#mc_filebox").css("display","block");
			$("#mc_dataindex").css("display","none");
			$("#mt_boxfile").css("display","block");
			$("#mt_boxindex").css("display","none");
		}
	});
});
