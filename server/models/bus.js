
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bus extends Model {
    static associate(models) {
      Bus.belongsTo(models.Route, {
        foreignKey: 'routeId',
        as: 'Route'
      });

      Bus.hasMany(models.Booking, {
        foreignKey: 'busId',
        as: 'bookings'
      });
    }
  }

  Bus.init(
    {
      busName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Bus name is required'
          }
        }
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0.01],
            msg: 'Price must be greater than zero'
          },
          isDecimal: {
            msg: 'Price must be a valid number'
          }
        }
      },
      routeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      }
    },
    {
      sequelize,
      modelName: 'Bus'
    }
  );

  return Bus;
};
