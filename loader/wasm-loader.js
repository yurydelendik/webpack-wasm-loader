// WebAssembly file loader prototype.

var fileLoader = require('file-loader');
var wasmparser = require('wasmparser');

function readWasmExternals(data) {
    var parser = new wasmparser.BinaryReader();
    parser.setData(data.buffer, 0, data.length);
    const BEGIN_SECTION = wasmparser.BinaryReaderState.BEGIN_SECTION;
    const IMPORT_SECTION_ENTRY = wasmparser.BinaryReaderState.IMPORT_SECTION_ENTRY;
    const EXPORT_SECTION_ENTRY = wasmparser.BinaryReaderState.EXPORT_SECTION_ENTRY;
    const IMPORT_SECTION_ID = wasmparser.SectionCode.Import;
    const EXPORT_SECTION_ID = wasmparser.SectionCode.Export;
    const bytesToString = wasmparser.bytesToString;
    var modules = Object.create(null);
    var exports = [];
    while (parser.read()) {
        switch (parser.state) {
            case BEGIN_SECTION:
                if (parser.result.id !== IMPORT_SECTION_ID &&
                    parser.result.id !== EXPORT_SECTION_ID) {
                    parser.skipSection();
                }
                break;
            case IMPORT_SECTION_ENTRY:
                var moduleName = bytesToString(parser.result.module);
                modules[moduleName] = true;
                break;
            case EXPORT_SECTION_ENTRY:
                var exportName = bytesToString(parser.result.field);
                exports.push(exportName);
                break;
        }
    }
    return {
        importModules: Object.keys(modules),
        exports: exports
    };
}
module.exports = function(content) {
	this.cacheable && this.cacheable();
    var externals = readWasmExternals(content);
    var buffer = [];
    buffer.push(fileLoader.call(this, content).replace('module.exports', 'var wasmPath'));
    buffer.push(`var imports = {${externals.importModules.map(mn => {
        return JSON.stringify(mn) + ': require("' + mn + '")';
    }).join(',')}};`);
    externals.exports.forEach(e => buffer.push(`exports.${e} = undefined;`));
    buffer.push('exports.__await = fetch(wasmPath).');
    buffer.push(' then(res => res.arrayBuffer()).');
    buffer.push(' then(arr => WebAssembly.instantiate(arr, imports)).');
    buffer.push(' then(({instance}) => {');
    externals.exports.forEach(e => buffer.push(`    exports['${e}'] = instance.exports['${e}'];`));
    buffer.push(' });');
    return buffer.join('\n');
}

module.exports.raw = true;
module.exports.topLevelAwait = true;
