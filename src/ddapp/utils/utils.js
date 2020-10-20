export default {
    //添加组件动画
    addCompoment(){
        document.addEventListener("dragstart", function( event ) {
            let target = event.target;
            let modelId = target.getAttribute("model_id");

            if(!modelId) return;

            event.dataTransfer.setData("model_id",modelId);

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
