
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Bus, {
        foreignKey: 'busId',
        as: 'Bus'
      });
    }
  }

  Booking.init(
    {
      passengerName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Passenger name is required'
          }
        }
      },
      seatNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Seat number must be positive'
          },
          isInt: {
            msg: 'Seat number must be an integer'
          }
        }
      },
      busId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        },
        unique: 'unique_bus_seat'
      }
    },
    {
      sequelize,
      modelName: 'Booking',
      indexes: [
        {
          unique: true,
          fields: ['busId', 'seatNo'],
          name: 'unique_bus_seat'
        }
      ]
    }
  );

  return Booking;
};
