# By Cherry 域名解析

`bycherry.me` 的代码和 GitHub Pages 绑定在项目侧已经配置好：

- `public/CNAME`: `bycherry.me`
- GitHub Pages custom domain: `bycherry.me`
- 部署方式: GitHub Actions workflow

如果 GitHub Actions 已经部署成功，但浏览器仍然打不开 `bycherry.me`，先检查 DNS。当前项目提供：

```sh
npm run verify:domain
```

## 当前常见错误

如果校验输出类似下面这样，说明域名还没有指向 GitHub Pages：

```txt
bycherry.me A: 198.18.1.48
www.bycherry.me A: 198.18.1.68
www.bycherry.me CNAME: none
```

这种情况下，GitHub Pages 部署成功也不会让 `bycherry.me` 正常打开。需要到域名服务商后台修改解析记录。

## 需要保留的记录

| 主机 | 类型 | 值 |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `liruirui321.github.io` |

## 需要删除的记录

删除所有不是上表的旧记录，尤其是：

| 主机 | 类型 | 错误值 |
| --- | --- | --- |
| `@` | A | `198.18.1.48` |
| `www` | A | `198.18.1.68` |

`www` 建议只保留一条 CNAME：`liruirui321.github.io`。不要同时保留 `www` 的旧 A 记录。

## 修改后检查

DNS 生效可能需要几分钟到数小时。改完后运行：

```sh
npm run verify:domain
```

通过后，再到 GitHub Pages 设置里确认：

- Custom domain 是 `bycherry.me`
- DNS check 通过
- HTTPS certificate 已签发
- Enforce HTTPS 已开启

在 DNS 修好前，`https://liruirui321.github.io/Bycherry/` 可能会被 GitHub Pages 重定向到 `bycherry.me`，所以不要用它判断代码是否部署成功。代码部署是否成功以 GitHub Actions run 和本地 `npm run build` 为准。
