export default {

    props: {
        componentData: Object,//父组件传入的控件的所有信息
        //判断是否为编辑状态
        isEdit:{
            type: Boolean,
            default: true,
        },
        isActive:{
            type: Boolean,
            default: false,
        },
        zIndex:{
            type: Number,
            default: 1
        }
    },

    created(){
        this.component = _.extend(this.component,this.componentData);
    },

    updated(){
        if(this.isEdit){
            this.$emit('syncData',this.component.id,this.component);
        }
    },

    methods:{

        handleDrag:function (e) {
            console.log("drag");
            this.component.x = parseFloat(e.x.toFixed(2));
            this.component.y = parseFloat(e.y.toFixed(2));
        },

        handleResize:function (e) {
            console.log("resize");
            this.component.width = parseFloat(e.w.toFixed(2));
            this.component.height = parseFloat(e.h.toFixed(2));
        },

        handleRotate:function (e) {
            console.log("rotate in mixin");
            this.component.rotate = parseFloat(e.angle.toFixed(2));
        },

        handleActivated:function () {
            this.$emit("selectChange",this.component.id);
        },

        syncInitData:function () {
            this.$emit("syncData",this.component.id,this.component);
        }

    },
    watch:{
        isActive:{
            handler(newValue){
                console.log("false");
                this.isActive = newValue;
            },
        },
        zIndex:{
            handler(newValue){
                console.log("zIndex",newValue);
                this.component.zIndex = newValue
            },
        }
    }
}
