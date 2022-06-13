"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "admin",
          email: "admin@gmail.com",
          encryptedPassword: bcrypt.hashSync("123", 10),
          roleId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "customer",
          email: "customer@gmail.com",
          encryptedPassword: bcrypt.hashSync("123", 10),
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
