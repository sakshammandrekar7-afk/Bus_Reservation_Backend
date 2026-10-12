
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check for duplicate bookings before adding the constraint
    const [duplicates] = await queryInterface.sequelize.query(`
      SELECT busId, seatNo, COUNT(*) AS total
      FROM Bookings
      GROUP BY busId, seatNo
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      throw new Error(
        'Duplicate seats exist. Resolve them before running this migration.'
      );
    }

    await queryInterface.addIndex(
      'Bookings',
      ['busId', 'seatNo'],
      {
        unique: true,
        name: 'unique_bus_seat'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'Bookings',
      'unique_bus_seat'
    );
  }
};
