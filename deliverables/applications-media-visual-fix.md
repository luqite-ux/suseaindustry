# Applications 图片区视觉修复记录

- 问题：Homepage Applications 区 5 张卡片中仅 2 张配置图片，其余 3 张渲染渐变占位；已配置图片使用 `object-contain` 和内边距，未铺满媒体容器。
- 修复：首页预览与 `/applications` 页面统一配置 5 张客户真实素材，删除占位分支的实际触发条件；图片统一采用无内边距的 `object-cover` 全出血展示。
- 桌面端验证：首页 5 张卡片、5 张图片、0 张占位，图片计算样式均为 `object-fit: cover`、`padding: 0px`。
- 390px 验证：首页与 Applications 页面均为 5 张卡片、5 张图片、0 张占位，无横向溢出；逐卡滚动触发入场后 5 张均加载并可见。
- 自动检查：`pnpm exec tsc --noEmit` 通过，`pnpm build` 通过，Impeccable detector 对两个改动文件返回空问题集。
- 工具链说明：仓库 `pnpm lint` 当前无法执行，因为项目未安装可调用的 ESLint 二进制；本次未以该结果替代构建、类型和真实浏览器验证。

证据：

- `deliverables/evidence/visual-fix/home-applications-desktop.png`
- `deliverables/evidence/visual-fix/home-applications-mobile-390-final.png`
- `deliverables/evidence/visual-fix/applications-mobile-390-final-loaded.png`
