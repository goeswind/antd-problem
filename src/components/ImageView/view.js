/**
 * 图片查看的弹出框，可进行操作图片放大，缩小等事件
 */
import $ from 'jquery';
let viewImage = {
    //初始化
    initView:function(imgSrc,imgParams){
        let zoom_n = 1;
        let spin_n = 0;
        //在盒子里面追加对应的p作为输入显示内容
        $("#maskLayerImgbox").append("<p id='imgP'><img src=\"\" alt=\"\"></p>");
        $("#maskLayerImgbox img").attr("src", imgSrc);
        //计算盒子的宽度和高度信息

       const box_width =  $("#maskLayerImgbox").width();
       const box_height = $("#maskLayerImgbox").height();

       //得到图片初始化的高度和宽度，
       const initial_width = imgParams.width;//初始图片宽度
       const initial_height =imgParams.height;//初始图片高度
       //处理宽度和高度，让图片进行居中显示

       if(box_width > initial_width && box_height > initial_height){//如果盒子宽度和高度均大于图片的宽度和高度
        //$(".auto-img-center img")
            $("#maskLayerImgbox img").css("margin-left",(box_width - initial_width) / 2);
            $("#maskLayerImgbox img").css("margin-top", (box_height - initial_height) / 2);
            
        }else{
            if (initial_width > initial_height) {
                 $("#maskLayerImgbox img").css("width", box_width);
                 const last_imgHeight  =initial_height/ (initial_width/box_width);;
                 $("#maskLayerImgbox img").css("margin-top", -(last_imgHeight - box_height) / 2);
            } else {
                 $("#maskLayerImgbox img").css("height", box_height);
                 const last_imgWidth = initial_width/ (initial_height/box_height);
                 $("#maskLayerImgbox img").css("margin-left", -(last_imgWidth - box_width) / 2);
             }

        }
        //绑定图片的拖拽功能
        let $div_img = $("#maskLayerImgbox p");
        $div_img.bind("mousedown", function (event) {
            event.preventDefault && event.preventDefault(); //去掉图片拖动响应
                //获取需要拖动节点的坐标
                const offset_x = $(this)[0].offsetLeft;//x坐标
                const offset_y = $(this)[0].offsetTop;//y坐标
                //获取当前鼠标的坐标
                const mouse_x = event.pageX;
                const mouse_y = event.pageY;
                //绑定拖动事件
                $("#maskLayerImgbox").bind("mousemove", function (ev) {
                    // 计算鼠标移动了的位置
                    const _x = ev.pageX - mouse_x;
                    const _y = ev.pageY - mouse_y;
                    //设置移动后的元素坐标
                    const now_x = (offset_x + _x ) + "px";
                    const now_y = (offset_y + _y ) + "px";
                    //改变目标元素的位置
                    $div_img.css({
                        top: now_y,
                        left: now_x
                    });
                });
        });
        //绑定 滚动事件，在这里吗绑定了两个事件是为了不同浏览器
        $div_img.bind("mousewheel DOMMouseScroll", function (e) {
            //阻止事件冒泡到根节点，这里主要是为了防止鼠标滚轮的时候，出现全body页面滚动，
            e.stopPropagation();
            e.preventDefault();
		    const delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
		                (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox
		    if (delta > 0) {
		        // 向上滚
		        zoom_n += 0.1;
                viewImage.viewLarge(zoom_n);
		    } else if (delta < 0) {
		        // 向下滚
                zoom_n -= 0.1;
                if(zoom_n<=0.1){
                    zoom_n = 0.1
                }
            	viewImage.viewSmall(zoom_n);
		    }
		});
        //当鼠标左键松开，接触事件绑定
        $("#maskLayerImgbox").bind("mouseup", function () {
            $(this).unbind("mousemove");
            $(this).unbind("mousewheel");
        });
        //放大处理
        $("#viwLarge").click(function () {
            zoom_n += 0.1;
            viewImage.viewLarge(zoom_n);
        });
        ///缩小
        $("#viewSmall").click(function () {
            zoom_n -= 0.1;
            if(zoom_n<=0.1){
                zoom_n = 0.1
            }
            viewImage.viewSmall(zoom_n);
        });
        //右旋转顺时针
        $("#viewRight").click(function () {
            spin_n += 90;
            $("#maskLayerImgbox img").parent("p").css({
                "transform":"rotate("+ spin_n +"deg)",
                "-moz-transform":"rotate("+ spin_n +"deg)",
                "-ms-transform":"rotate("+ spin_n +"deg)",
                "-o-transform":"rotate("+ spin_n +"deg)",
                "-webkit-transform":"rotate("+ spin_n +"deg)"
            });
        });
        //左旋转逆时针
        $("#viewLeft").click(function () {
            spin_n -= 90;
            $("#maskLayerImgbox img").parent("p").css({
                "transform":"rotate("+ spin_n +"deg)",
                "-moz-transform":"rotate("+ spin_n +"deg)",
                "-ms-transform":"rotate("+ spin_n +"deg)",
                "-o-transform":"rotate("+ spin_n +"deg)",
                "-webkit-transform":"rotate("+ spin_n +"deg)"
            });
        });
    },
    //图片放大
    viewLarge:function(zoom){
        $("#maskLayerImgbox img").css({
            "transform": "scale(" + zoom + ")",
            "-moz-transform": "scale(" + zoom + ")",
            "-ms-transform": "scale(" + zoom + ")",
            "-o-transform": "scale(" + zoom + ")",
            "-webkit-": "scale(" + zoom + ")"
        });
    },
    //图片缩小
    viewSmall:function(zoom){
        if (zoom <= 0.1) {
           // zoom_n = 0.1;
            $("maskLayerImgbox img").css({
                "transform":"scale(.1)",
                "-moz-transform":"scale(.1)",
                "-ms-transform":"scale(.1)",
                "-o-transform":"scale(.1)",
                "-webkit-transform":"scale(.1)"
            });
        } else {
            $("#maskLayerImgbox img").css({
                "transform": "scale(" + zoom + ")",
                "-moz-transform": "scale(" + zoom + ")",
                "-ms-transform": "scale(" + zoom + ")",
                "-o-transform": "scale(" + zoom + ")",
                "-webkit-transform": "scale(" + zoom + ")"
            });
        }
    },

   
}

export default viewImage