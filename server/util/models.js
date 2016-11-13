
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
};
