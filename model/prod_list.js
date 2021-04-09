'use strict'

module.exports = (sequelize, DataTypes) => {
	const prod_list = sequelize.define('prod_list', {
		lineType: {
			type: DataTypes.STRING,
			field: 'line_type',
			comment: '所属产品线'
		},
		prodName: {
			type: DataTypes.STRING,
			field: 'prod_name',
			comment: '产品名称'
		},
		prodImg: {
			type: DataTypes.STRING,
			field: 'prod_img',
			comment: '产品封面图'
		},
		createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      comment: "创建时间",
			defaultValue: sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      comment: "更新时间",
			defaultValue: sequelize.NOW
    }
	}, {
		tableName: 'prod_list',
		comment: '产品列表'
	})
	return prod_list
}