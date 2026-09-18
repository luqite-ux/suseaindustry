# PLA Basic 瀑布流图库验收

- 适用页面：`/products/pla-basic`
- 问题 ID：`VIS-MASONRY-GALLERY-INTERACTION`
- 布局：图片按自然比例展示；桌面 3 列、390px 1 列；无横向溢出。
- 入场：每张图片由独立视口观察器首次进入时渐显、轻微上移，错峰 0/80/160ms；屏外图片不由全局定时器提前完成。
- 操作：语义化图片按钮、桌面悬停反馈、手机点按、上一张/下一张、当前序号、Esc、焦点约束与关闭后焦点恢复均已实现。
- 滚动恢复：桌面端从第 40 张打开并切换至第 42 张后关闭，位置差约 `0.0002px`（浏览器浮点误差）；390px 从第 60 张打开、切换并关闭，位置差 `0px`。
- 焦点恢复：切换图片后关闭仍回到最初触发的第 40 / 第 60 张按钮。
- 减少动效：390px 下 `prefers-reduced-motion: reduce` 实测 `opacity: 1`、`transform: none`、`transition-duration: 0s`。
- 自动检查：图库状态单元测试 `3/3`、`tsc --noEmit`、Production build 和 Impeccable detector 均通过。
