$(function(){
	// 加载头部
	asyncaddtab("#main","/html/common/common_header.html","#head",function(){
		// 加载时间
		getnowtime("#header_date");
	});
	// 加载导航条
	asyncaddtab("#main","/html/common/common_header.html","#navbar",function(){
		// 加载选中样式
		var pagesnum = $("#main").attr("index");
		$(".navbar_nav_li").eq(pagesnum).addClass("active");
	});
	// 绑定一级菜单跳转
	firstmenuhref(".navbar_nav_li",fstmenuurl);
});