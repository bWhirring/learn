### npx

`npm v5.2.0引入的一条命令(npx)，npx会帮助执行依赖包里的二级制文件`

Usage

之前会这样写
```
./node_modules/.bin/webpack -v  or  `npm bin`/webpack -v
```

现在使用如下
```
`npm bin`/webpack -v
```

npx 也支持远程仓库的可执行文件

```
npx github:piuccio/cowsay hello  or npx cowsay hello
```

指定node版本运行`npm scripts`

```
npx -p node@8.9 npm run start
```

#### 特点:
- 临时安装可执行依赖包，不用全局安装，不用担心长期的污染
- 可以执行依赖包中的命令，安装完成自动运行
- 自动加载node_modules中的依赖包，不用指定$PATH
- 可以指定node版本、命令的版本，解决了不同项目使用不同版本的命令问题