### template parse

#### 模板为

```
let template = `
<ul>
  <% for(let i=0; i < data.supplies.length; i++) { %>
    <li><%= data.supplies[i] %></li>
  <% } %>
</ul>
`;
```

#### 将其转换成 Javascript 表达式字符串

```
echo('<ul>');
for(let i=0; i < data.supplies.length; i++) {
  echo('<li>');
  echo(data.supplies[i]);
  echo('</li>');
};
echo('</ul>');
```

#### 使用正则表达式

```
let evalExpr = /<%=(.+?)%>/g;
let expr = /<%([\s\S]+?)%>/g;

template = template
  .replace(evalExpr, '`); \n echo( $1 ); \n echo(`')
  .replace(expr, '`); \n $1 \n echo(`');

template = 'echo(`' + template + '`)'

```

#### 然后，将 template 封装在一个函数里面返回，就可以了

```
let script =
  `(function parse(data){
      let output = "";

      function echo(html) {
        output += html;
      }

      ${template}

      return output;
  })`;

return script;
```

#### 将上面的内容拼装成一个模板编译函数 `compile`

```
function compile(template){
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  let script =
  `(function parse(data){
    let output = "";

    function echo(html){
      output += html;
    }

    ${ template }

    return output;
  })`;

  return script;
}
```

#### 使用方法如下

```
let parse = eval(compile(template));
parse({ supplies: [ "broom", "mop", "cleaner" ] });
```
