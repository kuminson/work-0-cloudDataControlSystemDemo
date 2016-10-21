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
	},5000);
	// 手动选播
	$(".mbb_btn").on("click",function(){
		bannerleft = - $(this).index() * 1349;
		btnnbr = $(this).index();
		$(".mbb_btn").removeClass("active");
		$(".mbb_btn").eq(btnnbr).addClass("active");
		$(".mb_imgs").animate({marginLeft:bannerleft+"px"},0);
	});
	// 绑定工作平台跳转
	$("#hc_btn").on("click",function(){
		window.location.href = rooturl + "html/dataConfirm/dataConfirm.html";
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
});

// 加载当前日期
function getnowtime(id){
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
	$("#"+id).html("今天是 "+ timedate.year +"年"+ timedate.month +"月"+ timedate.date +"日 "+ timedate.week);
}