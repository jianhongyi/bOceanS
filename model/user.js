'use strict'


module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
		userName: {
			type: DataTypes.STRING,
			field: 'user_name',
			comment: '用户名'
		},
		userNameCN: {
			type: DataTypes.STRING,
			field: 'user_name_cn',
			comment: '用户中文名'
		},
		email: {
			type: DataTypes.STRING,
			field: 'email',
			comment: '邮箱'
		},
		password: {
			type: DataTypes.STRING,
			field: 'password',
			comment: '密码'
		},
		jurisdiction: {
			type: DataTypes.STRING,
			field: 'jurisdiction',
			comment: '权限 1具有上传权限 0 无上传权限'
		},
		userType:{
			type: DataTypes.STRING,
			field: 'user_type',
			comment: '用户类型'
		},
		userLineType:{
			type: DataTypes.STRING,
			field: 'user_line_type',
			comment: '用户产品线类型'
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
		tableName: 'user',
		comment: '用户列表'
	})
	return user
}