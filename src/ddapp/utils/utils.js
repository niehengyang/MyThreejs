export default {
    //添加组件动画
    addCompoment(){
        document.addEventListener("dragstart", function( event ) {
            let target = event.target;
            let widgetType = target.getAttribute("widget-type");
            let materialUrl = target.getAttribute("material-url");
            let modelUrl = target.getAttribute("model-url");
            let optionValue = target.getAttribute("option-value");

            if(!widgetType) return;

            console.log(widgetType);
            event.dataTransfer.setData("widget-type",widgetType);
            event.dataTransfer.setData("material-url",materialUrl);
            event.dataTransfer.setData("model-url",modelUrl);
            event.dataTransfer.setData("option-value",optionValue);

        }, false);

        document.addEventListener("dragend", function( event ) {
        }, false);

        /* 放下目标节点时触发事件 */
        document.addEventListener("dragover", function( event ) {
            // 阻止默认动作
            event.preventDefault();
        }, false);
    }

}
