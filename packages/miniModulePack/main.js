const fs = require("fs")
const path = require("path")

const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const { transformFromAst } = require("@babel/core")


class MiniModulePack {
  constructor() {
    this.index = 0;
  }

  createGraph(entry) {
    const mainAsset = this.createAsset(entry);

    const queue = [ mainAsset ];

    for(const asset of queue) {
      const dirname = path.dirname(asset.filename);
      asset.mapping = {};
      asset.dependencies.map(v => {
        const dependencePath = `./${path.join(dirname, v)}`;
        const childAsset = this.createAsset(dependencePath);
        asset.mapping[v] = childAsset.id
        queue.push(childAsset)
      })
    }
    return queue;
  }

  createAsset(filename) {
    const content = fs.readFileSync(filename, "utf8");
    const ast = parser.parse(content, {
      sourceType: "module"
    });

    const dependencies = [];

    traverse(ast, {
      ImportDeclaration: ({node}) => {
        dependencies.push(node.source.value);
      }
    })

    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })

    return {
      id: this.index ++ ,
      code,
      dependencies,
      filename,
    }
  }

  createBundle(graph) {
    let modules = "";
    graph.forEach(mod => {
      modules += `${mod.id}: [
        function (require, module, exports) { ${mod.code} },
        ${JSON.stringify(mod.mapping)},
      ],`;
    });
    const res = `(function(modules){
      function require(id) {
        const [ fn, mapping ] = modules[id];

        function requireModule(name) {
            return require(mapping[name]);
        }

        const module = { exports: {} };

        fn(requireModule, module, module.exports );

        return module.exports;
    }
    require(0)
    })({${modules}})`
    fs.writeFileSync(`pack.js`, res);
    return modules;

  }
}

const miniModulePack = new MiniModulePack();

const graph = miniModulePack.createGraph("./src/index.js");

miniModulePack.createBundle(graph)