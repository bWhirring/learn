#### babel plugin learn

##### plugin demo (reverse Identifier)

```
babel --plugins ./plugins/reverse.js index.js
```

or

config `.babelrc`

```
{
  "plugins": ["./plugins/reverse"]
}
```

```
babel index.js
```

##### preset demo

`.babelrc`

```
{
  "presets": [
    "./preset/"
  ]
}

```

```
babel index.js
```

arrow transform

```
npx babel --plugins ./plugins/arrow.js index.js
```
