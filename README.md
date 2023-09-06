# MockGenius
Intercept requests and directly return Mock data , including XMLHttpRequest, fetch class interface This is a Mock tool to intercept the corresponding request and directly return configuration data . It can help us in the development process , to reduce the dependence on interfaces , as far as possible to ensure that we can and more clear logic to develop or test code .

拦截请求并直接返回 Mock 数据，包括 XMLHttpRequest、fetch类接口
这是一款拦截对应请求并直接返回配置数据的 Mock 工具。它能帮助我们在开发过程中，减少对接口的依赖，尽可能保证我们能及更加清晰的逻辑来开发或者测试代码。

## Key Features:

### Seamless Data Mocking
Built on Vite 4 and Chrome Extension Manifest V3, MockGenius enables swift simulation of backend API data in your development environment, ensuring a smoother frontend development experience.
### User-Friendly Interface
With one-click installation and an intuitive interface, effortlessly set up and manage mock data without relying on real backend data for development and testing.
### Optimized for Development
Utilize MockGenius's development mode to view and modify simulated data in real-time, enabling rapid debugging of your frontend applications and boosting development cycles.
### Highly Customizable
Offering robust configuration options, precisely emulate various scenarios including different data types, states, and response times.


By embracing MockGenius, you'll unlock unparalleled development velocity and flexibility, making it easier to craft exceptional web applications. Install MockGenius now and explore limitless development possibilities!
## Installation
Run：
```
yarn
```

## Usage: Development

Run：
```
node watch.js
```
Saving a random file triggers compilation, which then loads or expands in the browser

## Build: Production Environment
 
Run：
```
yarn build
```
TODO: 
- [ ] mock返回的config的mock
- [ ] 增加动态前缀
- [ ] 根据字段含义能生成mock数据
- [ ] 支持对请求fetch类进行拦截
- [ ] 根据 swagger2.0 文档自动生成 Mock 数据
- [ ] 支持 GraphQL 请求的 Mock。
- [ ] 允许对匹配的接口进行 Redirect 操作。
- [ ] 提供 contains、equals 和 regexp 三种匹配模式，以满足不同的接口匹配需求
- [ ] 支持中英文两种语言。根据浏览器语言环境，自动显示对应的语言。
- [ ] 支持一键重置。
- [ ] 支持对 Mock 的配置进行 Clone。
- [ ] 支持 Mock 列表分组。
- [ ] 根据入参不同返回mock不同的返回值
- [ ] 支持期望来重复循环上百条数据
- [ ] 提取json数据结构
- [ ] 分页数据，根据入参的页数返回不同的数据
- [ ] 备选常用的生活数据进行mock
- [ ] 多语言
- [ ] 换肤
  
 
