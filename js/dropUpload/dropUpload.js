$(function(){
	$("#drop").dropzone({
		method: "get",
		url:"#",
		maxFilesize:100,
		parallelUploads: 5,
		dictDefaultMessage: "将文件或文件夹拖拽至此上传",
		previewTemplate: '<div class="dz-preview dz-file-preview">'
							+'<div class="dz-image">'
								+'<img data-dz-thumbnail />'
							+'</div>'
							+'<div class="dz-details">'
								+'<div class="dz-filename">'
									+'<span data-dz-name></span>'
								+'</div>'
								+'<div class="dz-size" data-dz-size></div>'
							+'</div>'
							+'<div class="dz-progress"></div>'
						+'</div>',
		init: function(){
			this.on("addedfile",function(file){
				// console.log(file.name);
				// 名字添加到datagrid上
				// 选中不带后缀的名字
				var realname = file.name.match(/(.+)\.\w+?$/);
				// 缓存不带后缀的名字
				window.top.yg_secondcache[window.top.yg_nowrowid].push(realname[1]);
				var col = parseInt(window.top.$("#mcd_datagrid").datagrid("getChecked")[0].columnno) -1;
				window.top.$("tr[datagrid-row-index='"+ col +"']").eq(1).find(".f_r_b").attr("src",rooturl + "images/common/folder.png");
				window.top.$("tr[datagrid-row-index='"+ col +"']").eq(1).find(".f_r_b").removeClass('frsfile');
				window.top.$("tr[datagrid-row-index='"+ col +"']").eq(1).find(".f_r_b").addClass('secindex');
			});
		}
	});
});