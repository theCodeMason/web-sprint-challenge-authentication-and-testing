const db = require('../../data/dbConfig');

function findById(id) {
    return db("users as u")
      .select("u.id", "u.username", "u.password")
      .where("u.id", id)
      .first()
  }

function findBy(filter) {
    return db("users as u")
    .select("username", "password")
    .where(filter)
}

async function add(user) {
    const [id] = await db("users").insert(user)
    return findById(id)
  }

  module.exports = {
    add,
    findBy,
    findById,
  };
