const codeGenerator = () => {
  var code = "";
  var min = 0;
  var max = 9;
  for (var i = 1; i <= 6; i++) {
    code += `${Math.floor(Math.random() * (max - min) + min)}`;
  }
  return code;
}


const keyList = (collection) => {
  let keys = []
  keys.push('_id')
  for (let property in collection.schema.obj) {
    keys.push(property)
  }
  return keys
}

module.exports = {
		keyList: keyList,
		codeGenerator: codeGenerator
}