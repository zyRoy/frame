define(['jquery', 'zTree'],function() {
    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var uid = 0;

    var TreeSelect = (function () {
        _createClass(TreeSelect, null, [{
            key: 'getUniquId',
            value: function getUniquId() {
                return uid++;
            }
        }]);

        function TreeSelect(options) {
            _classCallCheck(this, TreeSelect);

            var self = this;
            self.contentArrName=[];
            self.contentArrValue=[];
            var defaultOptions = {
                valueKey: 'id',
                isCheckBox:false
            };
            self.options = options = $.extend(defaultOptions, options);
            var ele = $(options.element);
            var uid = TreeSelect.getUniquId();
            var inputName =  ele.data("name")
            var inputCode =  ele.data("code")
            var tpl = '\n            <input type="text" class="form-control treeSelect-input" id="'+inputName+'" name = "'+inputName+'" /><input hidden id="'+inputCode+'" name="'+inputCode+'">\n             <div class="ztree treeSelect-panel" id="treeSelect_panel_' + uid + '"></div>\n        ';
         
            ele.html(tpl);
            var input = ele.find('.treeSelect-input');
            var hiddenInput = ele.find('.treeSelect-input').next();
            var panel = ele.find('.treeSelect-panel');
            
            self.element = ele;
            self.input = input;
            self.hiddenInput = hiddenInput;
            self.panel = panel;
            ele.css({
                'position': 'relative'
            });
            input.on('keydown', function () {

                //input.val(self.text);
                return false;
            });
            input.click(function () {
                if (!self.isOpen()) {
                    self.open();
                } else {
                    self.close();
                }
            });
            if (options.url) {
                $.ajax({
                    type: options.type,
                    url: options.url,
                    dataType: 'json',
                    data: options.param,
                    sucess: function sucess(data) {
                        self.render(data);
                    }
                });
            } else if (options.data) {
                self.render(options.data);
            }
        }

        _createClass(TreeSelect, [{
            key: 'isOpen',
            value: function isOpen() {
                var panel = this.panel;
                return !(panel.css('display') == 'none' || panel.height() == 0 || panel.css('opacity') == 0);
            }
        }, {
            key: 'render',
            value: function render(data) {
                var self = this;
                var panel = self.panel;
                var setting = {
                    callback: {
                        onClick: function onClick(event, treeId, treeNode) {
                            // if (!treeNode.isParent) {

                                self.input.next().val(treeNode.value)
                                console.log(self.input.next())
                                self.input.val(treeNode.name);
                                self.value = treeNode[self.options.valueKey];
                                // self.text = treeNode.name;
                                self.close();
                            // }
                        },
                       
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                  
                };
                 var setting2 = {
                    callback: {
                        
                         onCheck: function onClick(event, treeId, treeNode) {
                             var checkArr = []
                                try {
                                    if($.isArray(treeNode.children[0].children)){
                                        for(var i=0;i<treeNode.children.length;i++){
                                            for(var j = 0;j<treeNode.children[i].children.length;j++){
                                                checkArr.push(treeNode.children[i].children[j])
                                            }
                                        }
                                        
                                    }else{
                                        if($.isArray(treeNode.children)){
                                            for(var i=0;i<treeNode.children.length;i++){
                                            
                                                    checkArr.push(treeNode.children[i])
                                                
                                            }
                                        }else{
                                            checkArr.push(treeNode)
                                        }  
                                    }
                                } catch (error) {
                                    checkArr.push(treeNode)
                                }
                               
                            
                             for(var k = 0;k<checkArr.length;k++){
                                 if(checkArr[k].checked){
                                     if(self.contentArrValue.indexOf(checkArr[k].value)<0){
                                        self.contentArrValue.push(checkArr[k].value);
                                        self.contentArrName.push(checkArr[k].name);
                                        self.input.next().val(self.contentArrValue.join(","))
                                        self.input.val(self.contentArrName.join(","));
                                        self.value=self.contentArrValue.join(",");
                                     }
                                    
                                 }else{
                                    self.contentArrValue.splice(self.contentArrValue.indexOf(checkArr[k].value),1);
                                    self.contentArrName.splice(self.contentArrName.indexOf(checkArr[k].name),1);
                                    self.input.next().val(self.contentArrValue.join(","))
                                    self.input.val(self.contentArrName.join(","));
                                    self.value=self.contentArrValue.join(",");
                                 }
                                // if(self.contentArrValue.indexOf(checkArr[k].value)<0){
                                //     self.contentArrValue.push(checkArr[k].value);
                                //     self.contentArrName.push(checkArr[k].name);
                                //     self.input.next().val(self.contentArrValue.join(","))
                                //     self.input.val(self.contentArrName.join(","));
                                //     self.value=self.contentArrValue.join(",");
                                    
                                // }else{
                                //     self.contentArrValue.splice(self.contentArrValue.indexOf(checkArr[k].value),1);
                                //     self.contentArrName.splice(self.contentArrName.indexOf(checkArr[k].name),1);
                                //     self.input.next().val(self.contentArrValue.join(","))
                                //     self.input.val(self.contentArrName.join(","));
                                //     self.value=self.contentArrValue.join(",");
                                // }
                             }
                            //  if(self.contentArrValue.indexOf(treeNode.value)<0){
                            //      self.contentArrValue.push(treeNode.value);
                            //      self.contentArrName.push(treeNode.name);
                            //      self.input.next().val(self.contentArrValue.join(","))
                            //      self.input.val(self.contentArrName.join(","));
                            //      self.value=self.contentArrValue.join(",");
                                 
                            //  }else{
                            //      self.contentArrValue.splice(self.contentArrValue.indexOf(treeNode.value),1);
                            //      self.contentArrName.splice(self.contentArrName.indexOf(treeNode.name),1);
                            //      self.input.next().val(self.contentArrValue.join(","))
                            //      self.input.val(self.contentArrName.join(","));
                            //      self.value=self.contentArrValue.join(",");
                            //  }
                             console.log(self.contentArrValue)
                             console.log(self.contentArrName)
                         }
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType:{ "Y" : "s", "N" : "s" }
                    }
                };
                // 根据是否多选来选择回调的方法不同
                if(self.options.isCheckBox){
                    self.ztree = $.fn.zTree.init(panel, setting2, data);
                    var oneChildNode=[];
                    oneChildNode.push(self.ztree.getNodesByFilter(function(node){
                        try {
                            return(node.children.length==1)
                        } catch (error) {
                            
                        }
                        
                    }))
                   for(var i =0;i<oneChildNode[0].length;i++){
                       
	                    self.ztree.setChkDisabled(oneChildNode[0][i],true);

                   }
                }else{
                    self.ztree = $.fn.zTree.init(panel, setting, data);
                }

                
                

                self.input.val(data.name);
                self.value = data.value;
                self.text = data.name;
            }
        }, {
            key: 'open',
            value: function open() {
                var self = this;
                var panel = self.panel;
                panel.css({
                    height: 'auto',
                    opacity: 1
                });
                panel.show();
                self.mask = $('<div class="treeSelect-mask"></div>');
                $('body').append(self.mask);
                self.mask.click(function () {
                    self.close();
                });
            }
        }, {
            key: 'clear',
            value: function clear() {
                var self = this;
                self.input.val("");
                self.hiddenInput.val("")
                self.value = undefined;
                self.text = undefined;
                self.ztree.checkAllNodes(false);
            }
        }, {
            key: 'close',
            value: function close() {

                var self = this;
                //panel.animate({
                //    height:0,
                //    opacity:0
                //},500);
                self.panel.hide();
                self.mask.remove();
            }   
        },{
            key: 'reFill',
            value: function reFill(arr) {
                var self = this;
                
                for(var i = 0;i<arr.length;i++){
                    var checkTree=self.ztree.getNodeByParam("value",arr[i],null)
                    self.ztree.checkNode(checkTree)
                    self.contentArrValue.push(checkTree.value);
                    self.contentArrName.push(checkTree.name);
                    self.input.next().val(self.contentArrValue.join(","))
                    self.input.val(self.contentArrName.join(","));
                    self.value=self.contentArrValue.join(",");
                }
                // console.log(self.ztree.getNodeByParam("value","331121",null))
                // for(var i = 0;i<arr.length;i++){
                //     self.ztree.checkNode(arr[i])
                // }
            }
        }]);

        return TreeSelect;
    })();

    return  TreeSelect;

})

//# sourceMappingURL=treeSelect.js.map