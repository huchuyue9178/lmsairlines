# 老牧师航空（lmsairlines）
一个纯前端、静态的航空订票演示站点。以“虔诚 · 严谨 · 安心”为品牌内核，覆盖航班查询、预订、购物车、支付、订单、退改签、航班动态、在线客服等完整购票流程。
> ⚠️ 说明：本项目为**纯前端演示项目**，所有数据（航班、订单、购物车）均保存在浏览器 `localStorage` 中，支付为模拟流程，未接入真实后端与支付渠道，不可用于生产环境。
## 页面清单
| 页面 | 功能 |
| --- | --- |
| `index.html` | 首页、热门航线快捷查询 |
| `booking.html` | 机票预订：按城市/日期搜索，分页展示，选舱加入购物车 |
| `flight.html` | 航班动态：按航班号查询，根据当前时间实时计算状态 |
| `cart.html` | 购物车：增删、合计、模拟支付 |
| `order.html` | 我的订单：状态实时计算、按起飞时间窗口分档退票、免费改签一次 |
| `customer.html` | 客服中心：智能客服对话、投诉建议、FAQ |
| `about.html` / `policy.html` | 关于我们、服务政策指南 |
## 项目结构
```
lmsairlines/
├── index.html / booking.html / flight.html / cart.html / order.html
├── customer.html / about.html / policy.html
├── assets/
│   ├── tailwind-config.js   # Tailwind 主题配置（单一配置源）
│   ├── style.css            # 全站自定义样式
│   ├── data.js              # 航班数据单一数据源 + 工具函数
│   └── common.js            # 公共页头/页脚、导航、购物车、工具函数
└── README.md
```
## 本地运行
任意静态服务器即可，例如：
```bash
# Python 3
python3 -m http.server 8000
# 然后访问 http://localhost:8000/index.html
```
## 数据模型
- **航班**：`assets/data.js` 中的 `routeTemplate`（27 条航线）自动生成未来 30 天、含往返方向的航班，编号 `LMS001` 起。
- **购物车**：`localStorage["airCart"]`
- **订单**：`localStorage["airOrders"]`，字段含 `flightNo / start / end / date / time / cabin / price / username / idcard / status / createTime / changed` 等。
## 退改签规则（与 policy.html 一致）
- **退票手续费**：起飞前 24 小时以上 15%；4–24 小时 30%；4 小时以内及起飞后 50%。订单页按“当前时间 → 起飞时间”实时计算。
- **改签**：同等舱位免费改签一次，差价多退少补；订单已改签后按钮置灰。
- **订单状态**：支付后 5 秒内为“支付处理中”，之后自动转为“已完成”，由渲染时计算，不依赖定时器。
## 已知限制 / 后续建议
- 身份信息、订单数据以明文存于浏览器本地，仅限演示。
- 支付为 3 秒模拟；若要上线需接入真实后端、数据库、支付与短信验证。
- 航班为静态生成数据，未接真实航司/航班时刻。