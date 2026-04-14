// 1. 创建第一个 script 标签（引入 page-agent 库）
const script1 = document.createElement('script')
script1.src = 'https://test-s1.ljcdn.com/lease-qywx-static/0.0.5/page-agent.iife.js'
script1.crossOrigin = 'true'

// 2. 创建第二个 script 标签（初始化 PageAgent）
const script2 = document.createElement('script')
script2.textContent = `
  setTimeout(() => {
    const agent = new PageAgent({
      model: 'doubao-seed-2.0-pro',
      baseURL: 'http://0.0.0.0:8080',
      apiKey: '',
      language: 'zh-CN',
      maxActionsPerStep: 3,
      instructions: {
      system:
        'You MUST prioritize reliability over speed. Use multi-action batches only when it is clearly safe. Batching rule: Prefer a SINGLE action per step by default. You may output an action ARRAY with up to 3 actions (max 3) ONLY when all actions are on the same stable UI element(s) and do NOT depend on new elements appearing. NEVER batch actions that depend on page navigation, modal/dialog opening, dropdown suggestions, dynamic lists, or content that changes after the first action. After any click/select that may change the DOM, DO NOT batch the next action; instead return only that one action and let the next step re-observe. If you are unsure, output only ONE action. Waiting rule: If the page might still be loading / rendering after an action, prefer returning \`wait\` as the next single action (do not batch wait with other actions unless you are 100% sure it is safe). Index safety: Treat element indexes as potentially stale after any click/scroll/select/input that can change the DOM. Do not assume an index remains valid across multiple actions unless nothing on the page changes. Hard constraints: \`done\` must be the ONLY action in the step (never inside an action array). Do not output more than 3 actions in an action array.',
    },
});
agent.panel.show()
  }, 4000);
`

// 3. 依次插入页面（先加载库，再执行初始化）
document.head.appendChild(script1)
// 等待库加载完成后再插入执行脚本
script1.onload = () => {
	document.head.appendChild(script2)
	console.log('✅ PageAgent 脚本已成功插入并执行')
}

script1.onerror = () => {
	console.error('❌ page-agent 库加载失败')
}
