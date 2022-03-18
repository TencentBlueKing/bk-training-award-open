# 代码提交规范

## 代码检查建议
Bk-Award 工程一共涉及 Python/JavaScript 两种语言，我们开发团队默认使用如下工具进行代码检查，为了提高Merge效率，请提交前自行检测。

Python:
- flake8
- black
- isort
- mypy

相关配置请参考 [开发指引](../dev_guide.md)

JavaScript:
- ESLint


## commit相关格式

个人分支提交 commit 消息格式

```
type:messsge issue
```

* type 范围信息
  * feat 新功能
  * fix 错误修复
  * docs 文档更改
  * style （格式化，缺少半冒号等;没有代码更改）
  * refactor 代码重构重构
  * test 添加缺失的测试，重构测试;没有生产代码更改
  * chore 构建脚本，任务等相关代码
* message 本次提交的描述 
* issue 本次提交关联的 issue id

一个简单的提交消息例子：
```
fix: 修复因为某些原因导致的 bug #23
```

## Merge Request/Pull Request建议

开发者在各自 fork 分支可能会存在一些简单 commit 信息，提交 Merge Request 前建议使用 `git rebase` 进行 commit 精简。
精简信息请参照上一节。相关操作请参照如下流程：

```shell
#使用新分支做特性开发
git checkout feature1-pick
#多次调试与提交
git commit -m "xxx"
git commit -m "yyy"
git commit -m "zzz"
#如有引入新的第三方引用，使用 poetry 管理引用
poetry add some-package
#变基操作，合并多次变化（以下为3次），在feature1-pick分支下
#重新填写标准commit信息
git rebase -i HEAD~3
#推送到仓库远端
git push origin feature1-pick:feature1-pick
#提交PR/MR，等待合并
#......................
#......................
#PR/MR合并完成后，本地master分支跟进
git fetch upstream
git rebase upstream/master
```