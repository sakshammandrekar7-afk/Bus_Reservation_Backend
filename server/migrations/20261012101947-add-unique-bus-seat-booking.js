
'use strict';

module.exports = {
  async up(queryInterface) {
    const [duplicates] = await queryInterface.sequelize.query(`
      SELECT busId, seatNo, COUNT(*) AS total
      FROM Bookings
      GROUP BY busId, seatNo
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      throw new Error(
        'Duplicate seat bookings exist. Resolve them before migration.'
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
