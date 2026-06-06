# By Cherry 域名解析

`bycherry.me` 的代码和 GitHub Pages 绑定在项目侧已经配置好：

- `public/CNAME`: `bycherry.me`
- GitHub Pages custom domain: `bycherry.me`
- 部署方式: GitHub Actions workflow

如果线上看不到最新页面，先检查 DNS。当前项目提供：

```sh
npm run verify:domain
```

正确 DNS 记录：

| 主机 | 类型 | 值 |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `liruirui321.github.io` |

改完 DNS 后等待解析生效，再运行：

```sh
npm run verify:domain
```

通过后，再到 GitHub Pages 设置里开启 HTTPS enforcement。
