var global_userName = "系统管理员";
$(function(){
	// 判断登录状态
	if(global_userName != ""){
		$("#hir_btnexit").css("display","block");
		$("#hir_btn").css("display","none");
		$("#hir_user").html("您好 "+global_userName);
	}
	// 加载时间
	getnowtime("hil_time");
	// banner轮播
	var bannerleft = 0; //banner左移位置
	var btnnbr = 0; //所处位置
	// 自动轮播
	var bannertimer = setInterval(function(){
		bannerleft = bannerleft - 1349;
		$(".mb_imgs").animate({marginLeft:bannerleft+"px"},1000);

		 btnnbr = -bannerleft/1349;
		 if(btnnbr == 5){
		 	btnnbr = 0;
		 }
		 $(".mbb_btn").removeClass("active");
		 $(".mbb_btn").eq(btnnbr).addClass("active");
		if(bannerleft <= -6745){
			bannerleft = 0;
			$(".mb_imgs").animate({marginLeft:bannerleft+"px"},0);
		}
	},10000);
	// 手动选播
	$(".mbb_btn").on("click",function(){
		bannerleft = - $(this).index() * 1349;
		btnnbr = $(this).index();
		$(".mbb_btn").removeClass("active");
		$(".mbb_btn").eq(btnnbr).addClass("active");
		$(".mb_imgs").animate({marginLeft:bannerleft+"px"},0);
	});

	// 加载comboTree
	$("#offli_unit").combotree({
		url: rooturl + "unit.json",
		multiple:true
	});
	// 绑定工作平台跳转
	$("#hc_btn").on("click",function(){
		window.location.href = rooturl + "html/dataConfirm/dataConfirm.html";
	});
	// 绑定需求预案按钮事件
	$("#hc_btnframe").on("click",function(){
		$("#o_frame").window("open");
		$("#offli_time").textbox("setText",getnowtime("","1"));
	});
	// 绑定需求预案提交事件
	$("#off_submit").on("click",function(){
		$("#o_frame").window("close");
	});
	// 绑定资源列表弹出窗口事件
	$("#off_list").on("click",function(){
		$("#g_frame").window("open");
	});
	// 绑定登录页面跳转
	$("#hir_btn").on("click",function(){
		// window.location.href = "/cxy-web/login.jsp";
	});
	// 插入bar图表
	$("#mcs_chart").highcharts({
		chart:{
			type:"bar"
		},
		title:{
			text:null
		},
		xAxis:{
			categories:["文书","基建","设备"],
			title:{
				text:null
			}
		},
		yAxis:{
			min:0,
			title:{
				text:null
			},
			labels:{
				enabled:false
			}
		},
		tooltip:{
			valueSuffix:"份"
		},
		plotOptions:{
			bar:{
				dataLabels:{
					enabled:true
				}
			}
		},
		credits:{
			enabled:false
		},
		series:[{
			name:"标准目录",
			color:"#7CB5ED",
			data:[12321,3761,7866]
		},{
			name:"已收集",
			color:"#3FD0D5",
			data:[8637,2560,6332]
		}]
	});

	// 插入Gauges图表
	$("#mcec_left").highcharts({
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
				[0.1,"#11E6AC"]
			],
			min:0,
			max:100,
			title:{
				text:null
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
				y:60,
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

	// 插入Gauges图表
	$("#mcec_right").highcharts({
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
				text:null
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
				y:5,
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

	// 加载资源列表
	adddatalist("#gf_grid");

	// 消息通知 下拉列表
	// 绑定移入hir_info 显示下拉列表
	$("#hir_info").on("mouseenter",function(){
	  $("#infotriangle").removeClass("hide");
	  $("#infoalert").removeClass("hide");
	});
	// 绑定移出hi_right 隐藏下拉列表
	$(".hi_right").on("mouseleave",function(e){
	  $("#infotriangle").addClass("hide");
	  $("#infoalert").addClass("hide");
	});

	// 加载列表数据
	// 异步加载数据
	var menulist =[]; //下拉列表数据
	  $.ajax({
	    url: rooturl + "/menulist.json",
	    type: "POST",
	    dataType: "json",
	    data: {param1: 'value1'},
	    success:function(data){
	      // 缓存数据
	      menulist = data;
	      // 改变数字
	      changemenulistnum(menulist.length);
	      // 插入数据
	      createlistfromdata(menulist,0);
	      // 刷新按钮
	      refreshbtns(1,menulist);
	    },
	    error:function(data){
	      console.log("服务器链接失败");
	    }

	  });
	

	// 分页操作
	// 绑定按钮点击事件
	$("body").on("click",".ipl_btn",function(){
	  // 获取当前页
	  var pagenum = parseInt($(".ipl_btn.action").html());
	  // 判定跳转页
	  if($(this).attr("cont") != undefined && $(this).attr("cont") == "last"){
	    if(pagenum > 1){
	      pagenum -- ;
	    }
	  }else if($(this).attr("cont") != undefined && $(this).attr("cont") == "next"){
	    if(pagenum < Math.ceil(menulist.length / 6)){
	      pagenum ++;
	    }
	  }else{
	    pagenum = parseInt($(this).html());
	  }
	  // 刷新按钮
	  refreshbtns(pagenum,menulist);
	  // 刷新列表
	  createlistfromdata(menulist,(pagenum-1)*6);
	});

});

// 加载当前日期
function getnowtime(id,mode){
	var timedate = {};
	timedate.now = new Date;
	timedate.year = timedate.now.getFullYear();
	timedate.month = timedate.now.getMonth()+1;
	timedate.date = timedate.now.getDate();
	timedate.day = timedate.now.getDay()+1;

	switch(timedate.day){
		case 1:
		timedate.week = "星期日";
		break;
		case 2:
		timedate.week = "星期一";
		break;
		case 3:
		timedate.week = "星期二";
		break;
		case 4:
		timedate.week = "星期三";
		break;
		case 5:
		timedate.week = "星期四";
		break;
		case 6:
		timedate.week = "星期五";
		break;
		case 7:
		timedate.week = "星期六";
		break;
	}
	if(mode == undefined){
		$("#"+id).html("今天是 "+ timedate.year +"年"+ timedate.month +"月"+ timedate.date +"日 "+ timedate.week);
	}else{
		var modetime = timedate.year +"-"+ timedate.month +"-"+ timedate.date;
		return  modetime;
	}
}

// 生成列式表格
function creategrid(obj){
	var tbody = "";
	$.each(obj.data, function(key, val) {
		// 获取行数
		var rownbr = obj.data[key].length;
		var tr = "";
		// 将行标题压入
		for(var i=0; i<rownbr; i++){
			if(i == 0){
			var th = "<th colspan='1' rowspan='"+rownbr+"' width='"+obj.hw+"'>"+key+"</th>";
			var td = "<td colspan='1' rowspan='1' width='"+obj.dw+"'>"+obj.data[key][i]+"</td>";
				td = "<tr>"+th + td+"</tr>";
			}else{
			var td = "<td colspan='1' rowspan='1' width='"+obj.dw+"'>"+obj.data[key][i]+"</td>";
				td = "<tr>"+ td+"</tr>";
			}
			// 将行数据压入
			tr = tr + td;
		}
		// 将整体多行压入
		tbody = tbody + tr ;
	});
	tbody = "<tbody>"+tbody+"</tbody>";
	// console.log(tbody);
	$(obj.id).html(tbody);
}

// 加载资源列表
function adddatalist(id){
	$.ajax({
		url: "resource.json",
		type: "GET",
		dataType: "json",
		success:function(data){
			// 生成表格
			creategrid({
				data:data, //json格式数据
				hw:"20%",  //行标题宽度
				dw:"80%",  //行内容宽度
				id:id      //容器id(jquery选择器格式)
			});
		},
		error:function(){
			alert("服务器链接失败");
		}
	});
}

// 改变列表数字
function changemenulistnum(num){
  if(num>99){
    $("#hirb_nbr").html("99+");
  }else{
    $("#hirb_nbr").html(num);
  }
}

// 刷新列表
function createlistfromdata(data,num){
  // 清除原有标签
  $(".ii_info").remove();
  var tabs ="";
  for(var i=0; i<6; i++){
    // 生成标签
    if(data[num+i] == undefined){
      tabs += '<li class="ii_info"></li>';
    }else{
      tabs += '<li class="ii_info">'+data[num+i]+'</li>';
    }
  }
    // 插入标签
    $("#i_infolist").append(tabs);
}

// 刷新按钮组
function refreshbtns(num,data){
  // 获取数据总页数
  var allnum = Math.ceil(data.length / 6);
  var list = [];   //显示用列表
  if(allnum<=4){
    // 总页数少于5时
    for(var i=0; i<5; i++){
      if(i<allnum){
        list.push(i+1);
      }else{
        // 不足部分用空字符串补足
        list.push('');
      }
    }
  }else{
    // 总页数大于5时
    if(num<=2){
      // 当前页在前三时
      for(var i=0; i<5; i++){
        list.push(i+1);
      }
    }else if(num>=allnum-2){
      // 当前页在后三时
      for(var i=allnum-5; i<allnum; i++){
        list.push(i+1);
      }

    }else{
      // 当前页在中间时
      for(var i=num-3; i<num+2; i++){
        list.push(i+1);
      }
    }
  }
  // 插入页数按钮
  for(var i=0; i<5; i++){
    $(".ipl_btn").eq(i+1).html(list[i]);
    $(".ipl_btn").eq(i+1).attr("val",list[i]);
  }
  // 清除当前样式
  $(".ipl_btn").removeClass("action");
  $(".ipl_btn[val='"+num+"']").addClass("action");
}