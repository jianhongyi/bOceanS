'use strict'

module.exports = (sequelize, DataTypes) => {
	const line_type = sequelize.define('line_type', {
		typeName: {
			type: DataTypes.STRING,
			field: 'type_name',
			comment: '产品线类型名字'
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
		tableName: 'line_type',
		comment: '产品线类型'
	})
	return line_type
}
