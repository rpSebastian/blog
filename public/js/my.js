var link = "" ;
// 遍历所有的 img 标签
$("img").each( (i,o) => {
	var o = $(o);
    // 判断图片的链接是否包含 sinaimg 关键字
        // 给这个标签加上 referrerPlicy 属性
		o.attr("referrerpolicy","no-referrer");
        // 备份图片的 src
        link = o.attr("src");
        // 重新设置 src，让页面重新加载一次图片
		o.attr("src",link);
	
});