'use strict';
/** TODO  delete删除元素防止一些覆盖  */
/** 该程序编写未做架构规划，有大量冗余和耦合 ，功能是都实现了  后面会进行修改   */
let cssRender = {
    coverSelectHighlight: function (element) {
        element.style.backgroundColor = 'rgba(148,205,243,0.3)';
    },
    coverSelectDisHighlight: function (element) {
        element.style.backgroundColor = '';
    },
    selectRangeHighlight: function (element) {
        element.style.border = 'solid 2px rgb(187, 57, 57)';
        element.isRangeHighlight = true
    },
    selectRangeDisHighlight: function (element) {
        element.style.border = '';
        element.isRangeHighlight = false
    },
    tipRender: function () {
        let self = window.selectorHelper || SelectorHelper.prototype
        const divBox = self.document.createElement('div')
        const tipStyle = divBox.style
        let body = self.document.querySelectorAll('body')[0]
        divBox.id = 'tip'
        tipStyle.position = 'fixed'
        tipStyle.height = '500px'
        tipStyle.width = '600px'
        tipStyle.top = '0'
        tipStyle.right = '0'
        tipStyle.marginTop = '30px'
        tipStyle.backgroundColor = 'grey'
        tipStyle.fontSize = '16px'
        tipStyle.zIndex = '9999999'
        tipStyle.overflow = 'scroll'
        body.appendChild(divBox)
    },
}

let SelectorHelper = function () {
    this.__checkMouseMoveMethod_ = this._checkMouseMoveMethod.bind(this);
    this.currentElement = null;
    this.isShow = false
    this.isRunning = false
    this.isPause = false
    this.isFindSame = false
    this.document = undefined
};
SelectorHelper.prototype.get = function () {
    let self = window.selectorHelper || SelectorHelper.prototype
    return self.selectedVirtualDom.groupSelector
    // let exportInfo = null,groupSelectors = {}
    //
    // if (self.isRunning && groupSelectors && groupSelectors.length > 0){
    //     let groupSelector = groupSelectors[0]
    //     let group = groupSelector?.group || []
    //     if (!group) self.selectedVirtualDom?.selectedNodes?.map(val=>val.linkNode)
    //     let parent = groupSelector?.parent || ''
    //     const selector = groupSelector?.selector || ''
    //     const parentVNode = groupSelector?.node || {}
    //     group = Array.from(group)
    //     let text = '',textList= []
    //     if (parentVNode?.linkNode) text = parentVNode.linkNode.innerText
    //     group.forEach(node=>{
    //         if (node.innerText)  textList.push(node.innerText)
    //     })
    //     exportInfo = {
    //         parent,
    //         parentVNode,
    //         selector,
    //         group,
    //         textList,
    //         text,
    //     }
    //     // console.log(exportInfo)
    // }
    // return exportInfo  //  没有找到返回null
}

SelectorHelper.prototype.cut = function () {
    let self = window.selectorHelper || SelectorHelper.prototype
    // console.log(selectedVirtualDom);
    let groupSelector
    const groupSelectors = self.selectedVirtualDom?.groupSelector
    if (groupSelectors.length > 0){
        groupSelector = groupSelectors[0]
    }
    let group = groupSelector?.group || []
    if (!group) self.selectedVirtualDom?.selectedNodes?.map(val=>val.linkNode)
    let backupNodes = Array.from(group)
    self.document.body.innerHTML = ''
    backupNodes.forEach(newNode=>{
        if (newNode.name === '#document') return
        self.document.body.appendChild(newNode)
    })

}

SelectorHelper.prototype.selectedVirtualDom = {} // 已选择的构建的虚拟DOM
SelectorHelper.prototype.openFindSame = function () {
    /** 打开查找相似结点，不打开只会选择手动选择结点不会推荐相似结点 */
    let self = window.selectorHelper || SelectorHelper.prototype
    self.isFindSame = true
}

SelectorHelper.prototype.setDocument = function (document) {  // 设置一个操作域的document
    let self = window.selectorHelper || SelectorHelper.prototype
    self.document = document
}
SelectorHelper.prototype.addHighLights = function (Nodes) {
    /**@param {Node} Node  对某个或某组结点添加高亮
     * */
    let self = window.selectorHelper || SelectorHelper.prototype
    Nodes.forEach((ME) => {
        ME.isRangeHighlight = true
        cssRender.selectRangeHighlight(ME)
        self.clearChildHighLights(ME)  // 选择父级取消该结点下的所有子结点高亮
        self.traversalParentNode(ME, (Node) => {
            if (Node.isRangeHighlight && Node !== ME) {
                self.clearChildHighLights(Node, null, {deep: 0, includeOwn: true})  // 删除自身和子结点高亮 includeOwn表示清除包括自身和子结点的左右高亮
            }
        }, true)
    })

};
SelectorHelper.prototype.clearParentNodeChain = function (Node) {
    /**  */
    let self = window.selectorHelper || SelectorHelper.prototype
    let isDeleted = false
    // console.log(this.selectedVirtualDom);
    // const VNode = this.selectedVirtualDom.findVNode(Node)
    // if (VNode!== undefined) VNode.remove()
    // console.log(VNode);

}
SelectorHelper.prototype.clearChildHighLights = function (Node, doSomeFunction = null, option = {}) {
    /**@param {Node} Node  开始节点，会清除该节点的所有子节点高亮
     /* @param {Function} doSomeFunction
     /* @param {Object} option
     option = {
                deep: 清理深度  0表示只清理自身  默认null表示所有,
                includeOwn: 当清理多层的时候可指定是否清理自身,
                isClearChain : 是否清除父级链记录
            }
     */
    let self = window.selectorHelper || SelectorHelper.prototype
    Node = Node || self.document
    // let isClearChain = option['isClearChain'] || true
    let includeOwn = option.includeOwn || false
    let deep = option.deep >= 0 ? option.deep : null
    // console.log('deep',deep);

    let allSelectedChildren = self.findChildrenNodeAll(Node, (Node) => {
        return Node.isRangeHighlight
    }, {includeOwn, deep})
    allSelectedChildren.forEach((el, index) => {
        // console.log(deep,deep !== null && index > deep);
        if (deep !== null && index > deep) return
        if (el.isRangeHighlight) cssRender.selectRangeDisHighlight(el) // 点击外层移除内层已选
        if (doSomeFunction) doSomeFunction(el)
        // if (isClearChain) self.clearParentNodeChain(el)
    })
};

SelectorHelper.prototype.show = function (element) {
    /** 默认show函数,用于展示当前选择的文本,可覆盖重写该方法更换显示方式 */
    let self = window.selectorHelper || SelectorHelper.prototype
    if (self.document.getElementById('tip') === element
        && self.document.getElementById('tip').innerText.trim() === element.innerText.trim()) {
        return;
    }
    self.document.getElementById('tip').innerText = element.innerText
};

SelectorHelper.prototype._show_ = function (element) {
    /** 当show被重写作为中转 */
    let self = window.selectorHelper || SelectorHelper.prototype
    if (self.isShow)  SelectorHelper.prototype.show(element)
};
SelectorHelper.prototype.noShow = function () {
    /** 不显示默认的简易显示面板 */
    let self = window.selectorHelper || SelectorHelper.prototype
    self.isShow = false
};

SelectorHelper.prototype.getHighlightsRangeElements = function () {
    let self = window.selectorHelper || SelectorHelper.prototype
    let result = self.findChildrenNodeAll(self.document, (Node) => {
        return Node.isRangeHighlight
    }, {includeOwn: false})
    return result
};

SelectorHelper.prototype.open = function () {
    setTimeout(function () {
        let self = window.selectorHelper || SelectorHelper.prototype
        self.isRunning = true
        if (self.isShow)  cssRender.tipRender()
        console.log('SelectorHelper打开', self);
        self.document.addEventListener('mousemove', self.__checkMouseMoveMethod_);
    }, 0)
};

SelectorHelper.prototype.close = function () {
    let self = window.selectorHelper || SelectorHelper.prototype
    console.log('SelectorHelper关闭', self);
    self.isRunning = false
    self.document.removeEventListener('mousemove', self.__checkMouseMoveMethod_);
    self.findChildrenNodeAll(self.document, (Node) => {
        return Node.isRangeHighlight
    }, {includeOwn: true}).forEach(value => {
        // console.log(value);
        self.clearChildHighLights(value, null, {
            includeOwn: true,
        })  // 对获取到的已经高亮的Node进行清除
    })
};

SelectorHelper.prototype.traversalParentNode = function (Node, doSomeFunction, includeOwn = false) {
    let crrNode = includeOwn ? Node : Node.parentNode
    if (typeof doSomeFunction !== 'function') return
    for (; crrNode.parentNode; crrNode = crrNode.parentNode) {
        doSomeFunction(crrNode)  // 外部指定遍历的函数
    }
}

SelectorHelper.prototype.findChildrenNodeAll = function (Node, filterFunc = null, option = {}) {
    /**  遍历找某节点的所有子孙节点
     *  @param {Node} Node 开始节点
     *  @param {Function}  filterFunc 过滤函数,当函数为true加入返回结果列表
     *  @param {Object}  option  参数结构 {
     *                                    includeOwn　: 是否包含自身
     *                                    deep　: 查找深度,默认全部查找
     *                                  }
     * */
    let nodeList = []
    let includeOwn = option.includeOwn || false
    let deep = option.deep >= 0 ? option.deep : null
    if (includeOwn) {
        nodeList.push(Node)
    }
    let deepTraversal = (Node, nodeList, nowDeep) => {
        if (deep !== null && nowDeep >= deep) return
        if (Node != null) {
            let children = Node.children;
            for (let i = 0; deep || children && i < children.length; i++) {
                if (typeof (filterFunc) === 'function' && filterFunc(children[i])) {
                    nodeList.push(children[i]);
                } else if (filterFunc === null) {
                    nodeList.push(children[i]);
                }
                deepTraversal(children[i], nodeList, nowDeep++);
            }
        }
        return nodeList;
    }
    return deepTraversal(Node, nodeList, -1)
}

SelectorHelper.prototype.selectedVirtualDom.createSmartQuery = function (startVNode, endVNode) {
    /** 生成起始结点(子节点)，到结束结点(父结点)之间单链的最短的css选择器串值,endNode参数为空默认指向 document根节点 */
    let self = window.selectorHelper || SelectorHelper.prototype
    let queryOption = {}, main = undefined, fullPath = [], all = [], relativeParent = null, smart = '', full = null,
        findSamePath = null, selectorChain = []
    let VNode = startVNode
    let separator = '>'
    if (VNode.id) {
        main = '#' + VNode.id;
        queryOption['id'] = main
    }
    if (VNode.class) {
        if (!main) main = '.' + VNode.classList[0];
        queryOption['class'] = '.' + VNode.classList[0]
    }  //  有可能多个class 使用中间会有空格
    if (VNode.name) {
        if (!main) main = VNode.name;
        queryOption['tag'] = VNode.name
    }
    const attrs = Object.keys(VNode.attributes)
    const pattern = ['tag', '#id', '.class', 'tag.class', 'tag#id', 'tag[attr]', 'tag#id[attr]', 'nth-child', 'tag.class[attr]']
    const attrBanList = ['class','id','style','hidden','target','disabled']
    const parent = VNode.parent()
    const root = VNode.root()
    pattern.forEach((patternItem, index) => {
        switch (patternItem) {
            case 'tag':
                if (!VNode.name) break;
                all.push(VNode.name);
                break
            case '#id':
                if (!VNode.id) break;
                all.push('#' + VNode.id);
                break
            case '.class': {
                VNode.classList.forEach(val => {
                    if (!val) return;
                    all.push('.' + val)
                });
                break
            }
            case 'tag.class':
                VNode.classList.forEach(val => {
                    if (!val) return;
                    all.push(VNode.name + '.' + val)
                });
                break
            case 'tag#id':
                if (!VNode.id || !VNode.name) break;
                all.push(VNode.name + '#' + VNode.id);
                break
            case 'tag[attr]': {
                attrs.forEach(attr => {
                    if (!attr || !VNode.name) return;
                    if (attrBanList.includes(attr)) return;
                    all.push(VNode.name + '[' + attr + ']')
                })
            }
                break
            case 'tag#id[attr]': {
                attrs.forEach(attr => {
                    if (!attr || !VNode.id || !VNode.name) return;
                    if (attrBanList.includes(attr)) return;
                    all.push(VNode.name + '#' + VNode.id + '[' + attr + ']')
                })
            }
                break
            case 'nth-child': {
                if (parent) {
                    let mainSel = main
                    if (!main.includes('#') && VNode.classList.length) mainSel = '.' + VNode.classList[0]
                    all.push(mainSel + ':nth-child(' + VNode.index + ')')
                }
            }
                break
            case 'tag.class[attr]':
                break
        }
    })

    const filterSelector = () => {
        let isFound = false
        // let dom  = endNode ? endNode.linkNode : document  弃用
        if (parent.query.selectorChain !== undefined) {
            selectorChain = parent.query.selectorChain
        }
        all.forEach((selectorItem, index) => {     //  通过算法过滤筛选最短的css选择器,很准确,就是稍微烧机
            if (isFound) return
            let queryAllResult = []
            relativeParent = selectorItem
            if (selectorChain.length > 1) selectorItem = selectorChain.join(separator) + separator + selectorItem
            // console.log(selectorItem);
            queryAllResult = self.document.querySelectorAll(selectorItem)
            full = selectorItem
            if (queryAllResult.length === 1) {
                isFound = true;
            }
        })
        //------------------------------------------
        let selector = smart = full
        let fcs = selector.split(separator)
        //  有多个选择器的时候进来这里筛选去除冗余的选择器
        for (let i = 0; i < fcs.length; i++) {    //  当去掉其中一个选择器之后还能找到该唯一元素测去除该冗余选择器
            let queryResult = [], sa = []
            if (fcs.length > 1) sa = fcs.filter((val, index) => i !== index)
            // else if(fcs.length === 1) break
            selector = sa.join(separator)
            if (!selector) continue
            queryResult = self.document.querySelectorAll(selector)
            if (queryResult.length === 1) {
                // 这里为了减少计算只对选择的叶子结点selectedNodes计算，如果要对所有的结点计算用 allVNode对象
                if (VNode.root().selectedNodes.map(val => val.linkNode).includes(queryResult[0])) {  // 包含
                    if (sa.length === 1) break
                    smart = selector
                    if (fcs.length > 1) {
                        fcs = sa;
                        i--;
                    }
                    // console.log('所有能选择到的选择器:长度由长到短最后选最短',selector,queryResult);
                }
            }
        }
    }

    filterSelector()
    if (parent && parent.query) {
        if (parent.query.fullPath) fullPath = parent.query.fullPath.concat([queryOption])
        if (parent.query.selectorChain && parent.query.relativeParent) {
            selectorChain = parent.query.selectorChain.concat([relativeParent])
        }
    }
    // findSameNodes()
    VNode.query = {
        index: VNode.index,   // 基于真实DOM父级的兄弟索引
        relativeParent,   // 相对父级的 css选择器
        selectorChain,     // 当前的选择链,里面的值都是各VNode针对父级(非根结点document)的css选择器
        queryOption,    //  class , id ,tag
        findSamePath,  // (重要！！！) 用来基于最近的父节点找相似兄弟结点的path
        fullPath,     //  只有 class , id ,tag 的 选择链
        full,    //  全局唯一完整css选择器
        smart,  //  通过算法对full 进行筛选缩减的最佳 css选择器,生成后超级简洁,比浏览器直接复制的还好
        main,  // 优先级别 #id > .class > tag
        all,   // 所有针对该节点的待选选择器,其中必有一个针对父级唯一，和父级选择器拼接后就是全局唯一
        link: VNode.linkNode
    }
    // console.log(VNode.query);
    return VNode.query
}

SelectorHelper.prototype.selectedVirtualDom.findSameNodes = function (VNode){
    /**  TODO 将分组node，selector挂载到VNode根，进而优化智能推荐，通过选择的元素越多 推荐越准   */
    // 创建基于最近的父节点找相似兄弟结点的path
    let self = window.selectorHelper || SelectorHelper.prototype
    const root = VNode.root()
    const separator = '>'   // 这个变量后面修改提升为全局变量
    let findSamePath = VNode.query.findSamePath
    let full = VNode.query.full
    if (root.selectedNodes.length === 1){
        root.groupSelector = root.selectedNodes
        return;
    }
    // let prevParent = root
    // if (root.selectedNodes.length > 1){
    //     prevParent = root.findPrevFamily(VNode,{isFindRealDom:false}).root
    // }
    let prevParent = root.findPrevFamily(VNode,{isFindRealDom:false}).root
    if (prevParent.query || prevParent === document){
        if (!root.selectedNodes.includes(VNode)) return
        if (!prevParent.query.full) return
        findSamePath = full.replace(prevParent.query.full,'')
        const findSamePathPartList = findSamePath.split(separator).filter(val=>val!=='')
        if (findSamePathPartList.length > 0){
            let lastSelector = findSamePathPartList.shift()
            if (lastSelector.includes('nth-child')){
                lastSelector = lastSelector.split(':')[0]
            }
            findSamePathPartList.unshift(lastSelector)
        }
        findSamePath = findSamePathPartList.join(separator)   //  核心逻辑  后续提取更新新版
        //
        let group = prevParent.linkNode.querySelectorAll(findSamePath)
        // let group = document.querySelectorAll(findSamePath)
        if (group) group = Array.from(group)
        // console.log(findSamePath);
        // root.groupSelector.push({node:prevParent,selector:findSamePath,parent:prevParent.query.smart,  group})
        // console.log(group);

        root.groupSelector = group.map(rNode => {
            let newVNode =  selectorHelper.createVNode(rNode)
            let foundNode = root.selectedNodes.find(node => node.linkNode === newVNode.linkNode)
            if (foundNode){
                newVNode = foundNode
            }
            return newVNode
        })
        root.groupSelector.forEach(val=>{
            if (val.query && !val.query.findSamePath){
                val.query.findSamePath = findSamePath
            }
        })
        if (self.selectedVirtualDom && self.selectedVirtualDom.createSmartQuery){
            // root.groupSelector.forEach(vNode => self.selectedVirtualDom.createSmartQuery(vNode))
        }
        // if (root.groupSelector.length === 0) root.groupSelector = root.selectedNodes  // 该情况只选择了一个
        SelectorHelper.prototype.clearChildHighLights(self.document, null, { /* deep: 0,*/ includeOwn: true})
        SelectorHelper.prototype.addHighLights(group)
    }
}
SelectorHelper.prototype.createVNode = function (Node, args = {}, callback = null) {
    /** VNode 创建一个虚拟的VNode结点，所有关于虚拟结点结构的都在这里进行定义 ,部分逻辑外面定义   */
    const VNode = {}
    let isRoot = args.root || false
    let _methods = {}
    // 默认所有结点都包含的属性
    VNode.name = Node.nodeName.toLowerCase() || ''
    VNode.children = []
    VNode.classList = Array.from(Node.classList || [])
    VNode.classList.filter(clc=>{
        if (['\n','\t'].includes(clc)) return false
        return !isNaN(parseInt(clc+''))
    })

    VNode.attributes = {}
    VNode.id =  ''
    VNode.groupSelector = []   // { VNode , selector }
    VNode.linkNode = Node
    VNode.text = () => Node.innerText
    VNode.html = () => Node.innerHTML
    VNode.parent = () => args.parent
    VNode.root = () => {
        let root = VNode.parent();
        while (root && root.parent() !== undefined) {
            root = root.parent()
        }
        return root
    }
    VNode.remove = () => {  // 从vDOM中移除自身结点
        let vParent = VNode.parent()
        if (vParent) vParent.children.forEach((vNode, index) => {
            if (vNode === VNode) vParent.children.splice(index, 1)
        })
    }
    const root = VNode.root()
    for (let nk in Node.attributes) {
        const attr = Node.attributes[nk]
        if (typeof attr === 'function' || typeof attr === 'number') continue
        // VNode.attributes.length++
        VNode.attributes[attr.name] = attr.value || attr.textContent
        if (attr.name === 'class') VNode.class = VNode.attributes[attr.name]
        if (nk === 'id') VNode.id = VNode.attributes['id']
    }
    // 创建当前css选择可选query
    _methods.findPrevFamily = (fNode, option = {}) => {
        /** 找离自己最近包含多个孩子的祖先结点,找不到返回自身
         *  @param {VNode} VNode 需要往上找的起始结点
         *  @param {Number} familyNumLimit 对返回的结点的children 需达到 familyNumLimit 个以上才返回，不符合继续往上找
         * */
        let familyNumLimit = option.familyNumLimit || 2
        let isFindRealDom = option.isFindRealDom || false

        let getParent = (node) => {
            if (isFindRealDom && node.linkNode) return node.linkNode.parentNode
            else if (!isFindRealDom) return node.parent()
        }
        let prevRoot = fNode
        let finish = false
        const parentChain = []    // 该结点往上的结点链，第一个是该次查找的 root结点
        while (!finish) {
            let newPrevRoot = getParent(prevRoot)
            if (!newPrevRoot) break
            prevRoot = newPrevRoot
            parentChain.unshift(prevRoot)
            const children = prevRoot.children
            if (children.length >= familyNumLimit) break
        }
        return {
            root: prevRoot,
            chain: parentChain
        }
    }
    VNode.query = {}
    _methods.getVNodeIndex = () => {
        const prevFamilyNode = root.findPrevFamily(VNode, {familyNumLimit: 2, isFindRealDom: true}).root
        VNode.index = 1  //当前在所有兄弟中的索引位置,注意不是同标签！！！
        if (!prevFamilyNode.children) return
        for (let index in prevFamilyNode.children) {
            if (VNode.linkNode === prevFamilyNode.children[index]) {   // 数组最低是0
                VNode.index = parseInt(index) + 1   // 这边VNode.index限定最小为1
                // console.log('VNode.index ',VNode.name,VNode.index);
            }
        }
    }
    // 按外部指定需求和数据创建
    if (args.deep) VNode.deep = args.deep    //  基于document根节点的深度
    //  创建root结点和其专属属性
    if (isRoot) {
        VNode.allNode = Node.all      //  真实DOM中的所有结点
        VNode.allVNode = []     //当前虚拟DOM的所有结点
        VNode.findVNode = (realNode) => VNode.allVNode.find((vn) => realNode === vn.linkNode)   // 找根节点下真实Node转当前映射的虚拟Node,不可查根节点
        VNode.findPrevFamily = _methods.findPrevFamily
    }
    if (root) {
        if (!root.allVNode.map(val => val.linkNode).includes(VNode.linkNode)) root.allVNode.push(VNode)
    }
    VNode.create = () => {
        _methods.getVNodeIndex()
    }
    return VNode
}


SelectorHelper.prototype.createVirtualDom = function (selectedRelevanceChain, allRangeHighlightChildren) {
    /** 创建一个 虚拟DOM */
    let self = window.selectorHelper || SelectorHelper.prototype
    self.selectedVirtualDom = Object.assign(self.createVNode(self.document, {selectedRelevanceChain, root: true}), {}) // 创建虚拟DOM根节点
    const findChild = function (childNodes, vChildNode, deep) {
        deep++
        for (let ck in childNodes.children) {
            const childNode = childNodes.children[ck]
            if (childNode.nodeType !== 1) continue
            if (selectedRelevanceChain.includes(childNode)) {
                const newVNode = self.createVNode(childNode, {deep, parent: vChildNode, index: ck})
                let vNode = findChild(childNode, newVNode, deep)
                vChildNode.children.push(vNode)
            }
        }
        return vChildNode
    }
    findChild(self.document, self.selectedVirtualDom, 1)
    self.selectedVirtualDom.allVNode.forEach(vcNode => { vcNode.create() })
    self.selectedVirtualDom.selectedNodes = allRangeHighlightChildren.map(val => self.selectedVirtualDom.findVNode(val))
    self.selectedVirtualDom.allVNode.forEach(VNode => {
        if (VNode.smart) {   return  }
        SelectorHelper.prototype.selectedVirtualDom.createSmartQuery(VNode)
        SelectorHelper.prototype.selectedVirtualDom.findSameNodes(VNode)
    })
}

SelectorHelper.prototype.createVDomOption = function () {
    /** 用于构建高亮结点的虚拟DOM链准备 */
    let self = window.selectorHelper || SelectorHelper.prototype
    let allRangeHighlightChildren = self.getHighlightsRangeElements()
    let selectedRelevanceChain = []
    allRangeHighlightChildren.forEach(Nodes => {  // selectedRelevanceChain 当前选择的真实DOM结点
        self.traversalParentNode(Nodes, (Node) => {
            if (!selectedRelevanceChain.includes(Node)) {  // 如果当前结点不包含在结点链中
                selectedRelevanceChain.push(Node)  // 保存当前父级结点链
            }
        }, true)
    })
    return {
        selectedRelevanceChain,
        allRangeHighlightChildren
    }
}


SelectorHelper.prototype._checkMouseMoveMethod = function (mouseMoveEvent) {
    let self = this
    // if (mouseMoveEvent.shiftKey) {
    //     self.isPause = true
    // }
    if (mouseMoveEvent.shiftKey) return;
    if (!self.isRunning || self.currentElement === mouseMoveEvent['toElement']) {
        return;
    }  // 节流防抖
    self.currentElement = mouseMoveEvent["toElement"];
    const ME = mouseMoveEvent["toElement"]  // ME = mouseMoveEventToElement
    cssRender.coverSelectHighlight(ME)
    self._show_(mouseMoveEvent["toElement"]);
    if (ME.onclick === null) {
        ME.onclick = function (onclickEvent) {
            if (!self.isRunning) return
            onclickEvent.preventDefault()
            // if (onclickEvent && onclickEvent.preventDefault) {
            //     onclickEvent.preventDefault()
            //     console.log(onclickEvent);
            // }
        }
    }
    if (ME.onmouseout === null) {
        ME.onmouseout = function (onmouseoutEvent) {
            if (onmouseoutEvent && onmouseoutEvent.preventDefault) {
                onmouseoutEvent.preventDefault()
            }
            cssRender.coverSelectDisHighlight(ME)
            self.isPause = false
            ME.onmousedown = null
            ME.oncontextmenu = null
        }
    }
    if (ME.oncontextmenu === null) {
        ME.oncontextmenu = function (oncontextmenuEvent) {  // 阻止右键菜单
            if (oncontextmenuEvent && oncontextmenuEvent.preventDefault) {
                oncontextmenuEvent.preventDefault()
            }
        }
    }
    if (ME.onmouseup === null) {
        ME.onmouseup = function (onmousedownEvent) {
            if (onmousedownEvent && onmousedownEvent.preventDefault) {
                onmousedownEvent.preventDefault()
            }
        }
    }
    if (ME.onmousedown === null) {
        ME.onmousedown = function (onmousedownEvent) {
            if (onmousedownEvent && onmousedownEvent.preventDefault) {
                onmousedownEvent.preventDefault()
            }
            const selectedNodes = self.selectedVirtualDom.selectedNodes || []
            if (onmousedownEvent.button === 0) {
                if (selectedNodes && selectedNodes.length > 1){
                    self.clearChildHighLights(self.document, null, { /* deep: 0,*/ includeOwn: true})
                }
                // 鼠标左键进行高亮
                self.addHighLights([ME])   //  对单个 Node 添加高亮

            } else if (onmousedownEvent.button === 2) {
                // 鼠标右键取消高亮
                if (ME.isRangeHighlight) {
                    self.clearChildHighLights(self.document, null, { /* deep: 0,*/ includeOwn: true})
                    // self.selectedVirtualDom.selectedNodes.forEach(vNode=>{
                    //     self.clearChildHighLights(vNode.linkNode, null, {deep: 0, includeOwn: true})
                    // })
                }
            }
            const d = self.createVDomOption()
            self.createVirtualDom(d.selectedRelevanceChain,d.allRangeHighlightChildren)

            self.selectedVirtualDom.selectedNodes.forEach(val => {
                if (mouseMoveEvent["toElement"] === val.linkNode) {  // 最新点击的元素
                    // console.log(val.query.smart, document.querySelectorAll(val.query.smart)[0])
                }
            })

        }
    }
};


window.selectorHelper = new SelectorHelper();
// window.selectorHelper.setDocument(document)
// window.selectorHelper.open()
// window.selectorHelper.openFindSame()
window.selectorHelper.noShow()
// setTimeout(window.selectorHelper.getHighlightsRangeElements,6000)


// setTimeout(window.selectorHelper.close,6000)
// setTimeout(window.selectorHelper.open,12000)
// setTimeout(window.selectorHelper.close,20000)
// setTimeout(window.selectorHelper.open,25000)
// setTimeout(window.selectorHelper.close,30000)







