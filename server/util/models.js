module.exports = {
  users:{
    name: { type: String, required: true },
    password: { type: String, required: true}
  },
  menus: {
    data: { type: Object, required: true }
  },
  vues: {
    data: { type: Object, required: true }
  },
  products: {
    data: { type: Object, required: true }
  },
  suggests: {
    data: { type: String, required: true }
  },
  restaurants: {
    data: { type: String, required: true}
  },
  auths: {
    user: { type: String, require: true },
    token: { type: String, require: false },
    expires: { type: Date, require: true, default: new Date() }
  },
  allTableDatas: {
    type: {type: String, require: true},
    version: { type: String, require: true },
    pid: { type: String, require: true },
    date: { type: Date, require: true },
    value: { type: String, require: true },
    fd: { type: String, require: true },
    pm: { type: String, require: true },
    url: { type: String, require: true }
  }
};
