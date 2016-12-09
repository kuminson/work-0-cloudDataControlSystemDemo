$(function(){
	// 加载头部和导航条
	asyncaddtab("#main","html/common/common_header.html","#box","#head",function(){
		// 加载时间
		getnowtime("#header_date");
		// 加载选中样式
		var pagesnum = $("#main").attr("index");
		$(".navbar_nav_li").eq(pagesnum).addClass("active");

		// 加载列表数据
		// 异步加载数据
		  $.ajax({
		    url: rooturl + "menulist.json",
		    type: "GET",
		    dataType: "json",
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
	});
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);

	// 消息通知 下拉列表
	// 绑定移入header_notyet 显示下拉列表
	$("body").on("mouseenter","#header_notyet",function(){
	  $("#infotriangle").removeClass("hide");
	  $("#infoalert").removeClass("hide");
	  $("#infoback").removeClass("hide");
	});
	// 绑定移出hh_flright 隐藏下拉列表
	$("body").on("mouseleave","#hh_flright",function(e){
	  $("#infotriangle").addClass("hide");
	  $("#infoalert").addClass("hide");
	  $("#infoback").addClass("hide");
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

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 改变列表数字
function changemenulistnum(num){
  if(num>99){
    $("#hirb_nbr").html("99+");
  }else{
    $("#hirb_nbr").html(num);
  }
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> over >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
      tabs += '<li class="ii_info" yg_id="'+data[num+i].XXID+'" yg_url="'+data[num+i].XXLJ+'">'+data[num+i].XXNR+'</li>';
    }
  }
    // 插入标签
    $("#i_infolist").append(tabs);
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> over >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 刷新按钮组
function refreshbtns(num,data){
  // 获取数据总页数
  var allnum = Math.ceil(data.length / 6);
  var list = [];   //显示用列表
  if(allnum<=4){
    // 总页数少于5时
    for(var i=0; i<allnum; i++){
      list.push(i+1);
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
  // 清除按钮
  $(".ip_list").has(".ipl_btn[val]").remove();
  // 插入页数按钮
  for(var i=0; i<list.length; i++){
    // $(".ipl_btn").eq(i+1).html(list[i]);
    // $(".ipl_btn").eq(i+1).attr("val",list[i]);
    // 添加按钮
    var listbtn = '<li class="ip_list">'
                   +'<a class="ipl_btn" href="#" val="'+list[i]+'">'+list[i]+'</a>'
                 +'</li>';
    $(".ip_list").has(".ipl_btn[cont='next']").before(listbtn);

  }
  // 清除当前样式
  $(".ipl_btn").removeClass("action");
  $(".ipl_btn[val='"+num+"']").addClass("action");
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> over >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
