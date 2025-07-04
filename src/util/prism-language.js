import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
// 导入需要的语言支持
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-sql'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/components/prism-nginx'


// 触发高亮函数暴露出去
export const highlightAll = () => {
  Prism.highlightAll()
}

// 让 Prism 识别 docker 作为 dockerfile 的别名
if (Prism.languages.dockerfile) {
  Prism.languages.docker = Prism.languages.dockerfile
}

export default Prism