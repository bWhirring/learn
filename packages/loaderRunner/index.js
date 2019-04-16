const fs = require("fs")
const path = require("path")
const { runLoaders } = require("loader-runner")

runLoaders({
	resource: path.resolve(__dirname, "./test.js"),
	// String: Absolute path to the resource (optionally including query string)

	loaders: [
    path.resolve(__dirname, "./loader1.js"),
    path.resolve(__dirname, "./loader.js?name=1&test=huhu"),
  ],
	// String[]: Absolute paths to the loaders (optionally including query string)
	// {loader, options}[]: Absolute paths to the loaders with options object

	context: { minimize: true },
	// Additional loader context which is used as base context

	readResource: fs.readFile.bind(fs)
	// A function to read the resource
	// Must have signature function(path, function(err, buffer))

}, function(err, result) {
  console.log(err, "err");
  console.log(JSON.stringify(result), "result")
	// err: Error?

	// result.result: Buffer | String
	// The result

	// result.resourceBuffer: Buffer
	// The raw resource as Buffer (useful for SourceMaps)

	// result.cacheable: Bool
	// Is the result cacheable or do it require reexecution?

	// result.fileDependencies: String[]
	// An array of paths (files) on which the result depends on

	// result.contextDependencies: String[]
	// An array of paths (directories) on which the result depends on
})