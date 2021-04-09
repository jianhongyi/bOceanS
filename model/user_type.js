'use strict'

module.exports = (sequelize, DataTypes) => {
	const user_type = sequelize.define('user_type', {
		typeName: {
			type: DataTypes.STRING,
			field: 'type_name',
			comment: '用户类型名字'
		},
		createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      comment: "创建时间"
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      comment: "更新时间"
    }
	}, {
		tableName: 'user_type',
		comment: '用户类型表'
	})
	return user_type
}