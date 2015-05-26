/**
 * @ Description: allScreenSlide
 * @ Author: liuwentao
 * @ Update: liuwentao(2015-01-05)
 * @ $("boxId").libAnimate({            //box的class/id
 * @	height:"300",				   	//box的高度，图片的高度
 * @	slideTimer:5,					//自动轮播的速度
 * @	animateSlide:[["top","fadeIn"],["fadeIn","top"],["fadeIn","right"]],
 * @
 * @		//动画进入的5种方式，从顶部、从底部、从左边、从右边、渐隐渐变，分别对应的名称top\bottom\left\right\fadeIn
 * @		//[["top","fadeIn"],["fadeIn","top"],["fadeIn","right"]] 分别对应3个轮播item的效果，
 * @		//每一帧轮播有3张图片，第一张默认是渐隐渐出，第二张是["top","fadeIn"]的第一个参数，第三张是["top","fadeIn"]的第二个参数
 * @		//有几帧动画就有几个["top","fadeIn"]参数
 * @
 * @	callBack:function(me){} 		//回调函数
 * @ })
 **/
var yhdLib_foundation = function(element,option){
	this.$element = $(element);
	this.option = option;
	this.init(element,option);
}
yhdLib_foundation.DEFAULTS={
	height:"",
	slideTimer:4,
	animateSlide:[],
	callBack:function(me) {}
}
yhdLib_foundation.prototype.init=function(element,option){
	this.option= $.extend({}, this.DEFAULTS, option);
	this.show(element);

}
/*全屏轮播初始化*/
yhdLib_foundation .prototype.show=function(element){
	var promo_show = $(element).css('overflow', 'hidden'),
		pointBox = promo_show.find('.promo_num'),
		ol = promo_show.find("ol"),
		olLi = ol.find("li"),
		screenWidth = $(window).width(),
		slideNum = ol.find("li").length,
		point;
	if(screenWidth < 1200){
		screenWidth = "1200px";
	}
	promo_show.width(screenWidth).height(this.option.height+"px");
	ol.width(screenWidth).height(this.option.height+"px").find('li').width(screenWidth).height(this.option.height+"px");
	if(slideNum > 1){
		for(var i = 0;i<slideNum;i++){
			pointBox.find("ul").append('<li>•</li>');
		}
		point = promo_show.find('ul>li');
		this.animateLoad(ol ,olLi.eq(0),0,point);
		this.loadAntherImg(ol,point);
		this.pointHover(ol,point);
		//this.timeAuto(promo_show,ol,point,option);
	}else{
		pointBox.remove();
		this.animateLoad(ol ,olLi.eq(0),0,point);
	}
	this.winSize(promo_show,ol);
	if(this.option.callBack){
		this.option.callBack(promo_show);
	}

}
/*获取图片数组*/
yhdLib_foundation .prototype.animateLoad=function(ol , olLiEqNum,EqNum,point){
	var arrImg = [];
	if($.browser.msie&& $.browser.version=='6.0'){
		arrImg.push(olLiEqNum.find(".animate_three").attr("date-img6"));
	}else{
		olLiEqNum.find(".animate_img").each(function(){
			arrImg.push($(this).attr("date-img"));
		});
	}

	this.loadImg(ol,arrImg ,point,olLiEqNum,EqNum);
}
/*判断图片是否加载完成*/
yhdLib_foundation.prototype.loadImg=function(ol,arrImg,point,olLiEqNum,EqNum){
	var loadNum=0;
	var _this=this;
	function _loadImg() {
		var img = new Image();
		var len = arrImg.length;
		img.onload = function () {
			if (loadNum < len - 1) {
				loadNum++;
				_loadImg();
			} else {
				_this.animatePic(ol,olLiEqNum ,EqNum, point);
			}
		}
		img.src = arrImg[loadNum];
	}
	_loadImg();
}
/*图片加载完成，给上背景图*/
yhdLib_foundation.prototype.animatePic = function(ol,olLiEqNum ,EqNum, point ){
	olLiEqNum.css("background","#fff");

	if($.browser.msie&& $.browser.version=='6.0'){
		olLiEqNum.find(".animate_three").css("background-image", "url(" +olLiEqNum.find(".animate_three").attr("date-img6") + ")");
	}else{
		olLiEqNum.find(".animate_img").each(function(){
			$(this).css("background-image","url("+$(this).attr("date-img")+")");
		});
	}
	if(EqNum==0){
		this.moveTo(ol,0,point);
		if(point){
			var promo_show = this.$element;
			this.timeAuto(promo_show,ol,point);
		}
	}
}

/*轮播切换动画*/
yhdLib_foundation.prototype.moveTo = function(ol,num,point){

	var showType=this.option.animateSlide[num];
	var liNum = ol.find("li").eq(num);
	if(!point){
		this.imgAnimate(liNum,showType);
		return false;
	}
	if (!point.eq(num).hasClass('cur')) {

		point.eq(num).addClass('cur').siblings('.cur').removeClass('cur');
		ol.stop();
		liNum.addClass("cur").fadeIn(400).siblings('li').removeClass("cur").fadeOut(400);
		liNum.find(".animate_two").hide();
		liNum.find(".animate_three").hide();
		this.imgAnimate(liNum,showType);

	}
}
/*3帧动画执行*/
yhdLib_foundation.prototype.imgAnimate=function(liNum,showType){
	var _this = this;
	if($.browser.msie&& $.browser.version=='6.0'){
		liNum.find(".animate_three").fadeIn(400);
	}else{
		liNum.find(".animate_one").fadeIn(400,function(){
			setTimeout(function() {
				_this.typeAnimate(liNum.find(".animate_two"), showType[0]);
				setTimeout(function () {
					_this.typeAnimate(liNum.find(".animate_three"), showType[1]);
				}, 360);
			},400);
		});
	}
}
/*动画效果执行*/
yhdLib_foundation.prototype.typeAnimate=function(picbox,showTypeTxt){
	var screenWidth=$(window).width();
	switch (showTypeTxt)
	{
		case "top":
			picbox.css({"top":-this.option.height,"display":"block"});
			picbox.animate({top:0},300,function(){
				$(this).animate({top:"-10px"},30,function(){
					$(this).animate({top:0},30);
				})
			})
			break;
		case "left":
			picbox.css({"left":-screenWidth,"display":"block"});
			picbox.animate({left:0},300,function(){
				$(this).animate({left:"-10px"},30,function(){
					$(this).animate({left:0},30);
				})
			})
			break;
		case "bottom":
			picbox.css({"top":this.option.height+"px","display":"block"});
			picbox.animate({top:0},300);
			break;
		case "right":
			picbox.css({"left":screenWidth,"display":"block"});
			picbox.animate({left:0},300);
			break;
		case "fadeIn":
			picbox.hide();
			picbox.fadeIn(300);
			break;
	}
}
/*1s后加载其他帧图片*/
yhdLib_foundation.prototype.loadAntherImg=function(ol,point){
	var _this=this;
	setTimeout(function(){
		for(var i=1;i<point.length;i++){
			_this.animateLoad(ol ,ol.find("li").eq(i),i,point);
		}
	},1000);
}
/* point hover切换 */
yhdLib_foundation.prototype.pointHover=function(ol,point) {
	var timer = null;
	var _this = this;
	point.bind('mouseenter', function () {
		var index = point.index($(this));
		timer = setTimeout(function () {
			_this.moveTo(ol, index, point);
		}, 200);
	});
	point.bind('mouseleave', function () {
		clearTimeout(timer);
	});
}
/*自动轮播/hover上去停止*/
yhdLib_foundation.prototype.timeAuto=function(promo_show,ol,point){
	var hover=false;
	var _this=this;
	//自动切换的开始与暂停
	var _auto = (function() {
		var timeId;
		return {
			start: function() {
				hover = false;
				timeId = setTimeout(function() {

					_this.moveTo(ol,point.index((point.filter('.cur').next().length ? point.filter('.cur').next() : point.eq(0))),point);
					_auto.start();
				}, _this.option.slideTimer*1000);
			},
			stop: function() {
				hover = true;
				clearTimeout(timeId);
			}
		};
	})();
	_auto.start();
	//移上去停止自动切换 移除继续
	promo_show.hover(function() {
		_auto.stop();
	}, function() {
		_auto.start();
	});
}
/*浏览器窗口改变时触发*/
yhdLib_foundation.prototype.winSize = function(promo_show,ol){
	$(window).bind('resize', function () {
		var screenWidth = $(window).width();
		if (screenWidth < 1200) {
			promo_show.css({'width': '1200px'});
			ol.find('li').width('1200px');
			return false;
		}
		promo_show.width(screenWidth);
		ol.find('li').width(screenWidth);
	});
}

$.fn.libAnimateSlide = function(option){
	var options = typeof option == 'object' && option;
	return new yhdLib_foundation(this,options);
}
