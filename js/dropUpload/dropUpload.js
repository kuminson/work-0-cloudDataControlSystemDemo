$(function(){
	$("#drop").dropzone({
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
				// console.log(window.parent.yg_nowrowid);
				// 名字添加到datagrid上
			});
		}
	});
	// console.log(window.parent.yg_nowrowid);
	var lala = 2;
});