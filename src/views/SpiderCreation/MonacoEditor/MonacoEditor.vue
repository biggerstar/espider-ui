<template>

  <div v-loading="false" id="root" ref="root"></div>

</template>

<script setup >
import { ref, onMounted, onUnmounted } from "vue";



import * as monaco from 'monaco-editor'
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// import 'monaco-editor/esm/vs/editor/editor.all'
// import 'monaco-editor/esm/vs/editor/edcore.main'
// import 'monaco-editor/esm/vs/editor/editor.main'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// import { language as pythonLanguage } from 'monaco-editor/esm/vs/basic-languages/python/python.js';
// import { StandaloneCodeEditorService } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeEditorService.js'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (['typescript', 'javascript'].includes(label)) {
      return new TsWorker()
    }
    return new EditorWorker()
  }
}


// 1. 引入monaco-editor中的python文件
import { language as JsLanguage } from 'monaco-editor/esm/vs/basic-languages/javascript/javascript.js';

// 2. 创建代码提醒
monaco.languages.registerCompletionItemProvider('javascript', {
  provideCompletionItems: (model, position) => {
    // console.log(model);
    console.log(position);
    let textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });
    let match = textUntilPosition.match(
        /"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/
    );
    // if (!match)  return { suggestions: [] }
    let word = model.getWordUntilPosition(position)
    // console.log(word);
    let range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };

    let suggestions = [];
    // console.log(JsLanguage);
    // 这个keywords就是python.js文件中有的
    JsLanguage.keywords.forEach(item => {
      // console.log(item);
      suggestions.push({
        label: item,
        detail: item,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: item,
        range:range,
      });
    })
    console.log(suggestions);
    return {
      // 最后要返回一个数组
      suggestions:suggestions,
      incomplete:false
    };
  },
});

const root = ref()
let editor
onMounted(() => {
  // validation settings
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });

// compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    allowNonTsExtensions: true
  });
  editor = monaco.editor.create(root.value , {
    language: 'javascript',
    // theme:'vs-dark',
    // automaticLayout:true,
    // lineNumbers: 'on',
    // roundedSelection: false,
    // scrollBeyondLastColumn: false,
    // readonly: false,
    value: window.generatedCodeString ,
  })
  console.log(editor.getValue());
})
onUnmounted(() => {
  editor.dispose()
})

// const provider = monaco.languages.registerCompletionItemProvider("sql", {
//   provideCompletionItems(model, position) {
//     let textUntilPosition = model.getValueInRange({
//       startLineNumber: position.lineNumber,
//       startColumn: 1,
//       endLineNumber: position.lineNumber,
//       endColumn: position.column
//     });
//     let suggestions = createCompleters(textUntilPosition);
//     return {
//       suggestions: suggestions
//     };
//   }
// });

// let createCompleters = textUntilPosition => {
//   //过滤特殊字符
//   let _textUntilPosition = textUntilPosition
//       .replace(/[\*\[\]@\$\(\)]/g, "")
//       .replace(/(\s+|\.)/g, " ");
//   //切割成数组
//   let arr = _textUntilPosition.split(" ");
//   //取当前输入值
//   let activeStr = arr[arr.length - 1];
//   //获得输入值的长度
//   let len = activeStr.length;
//
//   //获得编辑区域内已经存在的内容
//   let rexp = new RegExp('([^\\w]|^)'+activeStr+'\\w*', "gim");
//   let match = that.value.match(rexp);
/*  let _hints = !match ? [] : match.map(ele => {*/
/*    let rexp = new RegExp(activeStr, "gim");*/
/*    let search = ele.search(rexp);*/
/*    return ele.substr(search)*/
/*  })*/

/*  //查找匹配当前输入值的元素*/
/*  let hints = Array.from(new Set([...that.hints, ..._hints])).sort().filter(ele => {*/
/*    let rexp = new RegExp(ele.substr(0, len), "gim");*/
/*    return match && match.length === 1 && ele === activeStr || ele.length === 1*/
/*        ? false*/
/*        : activeStr.match(rexp);*/
//   });
//   //添加内容提示
//   let res = hints.map(ele => {
//     return {
//       label: ele,
//       kind: that.hints.indexOf(ele) > -1 ? monaco.languages.CompletionItemKind.Keyword : monaco.languages.CompletionItemKind.Text,
//       documentation: ele,
//       insertText: ele
//     };
//   });
//   return res;
// };









</script>

<style scoped>
#root {
  width: 100vw;
  height: 100vh;
}
</style>
