const fs = require("fs")



const read = (dir) => {
  return JSON.parse(fs.readFileSync(dir, { encoding: "utf-8" }))
}

const write = (dir, data) => {
  fs.writeFileSync(dir, JSON.stringify(data, null, 4), {
    encoding: "utf-8",
  });
  return "OK"
}



module.exports = {read, write}