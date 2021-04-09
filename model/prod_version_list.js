"use strict";

module.exports = (sequelize, DataTypes) => {
  const prod_version_list = sequelize.define(
    "prod_version_list",
    {
      prdId: {
        type: DataTypes.STRING,
        field: "prd_id",
        comment: "项目id",
      },
      prdName: {
        type: DataTypes.STRING,
        field: "prd_name",
        comment: "项目名称",
      },
      fileName: {
        type: DataTypes.STRING,
        field: "file_name",
        comment: "文件名",
      },
      fileUrl: {
        type: DataTypes.STRING,
        field: "file_url",
        comment: "文件地址",
      },
      prdType: {
        type: DataTypes.STRING,
        field: "prd_type",
        comment: "文件类型,UI/原型",
      },
      prodId: {
        type: DataTypes.STRING,
        field: "prod_id",
        comment: "属于哪个产品",
      },
      picUrl: {
        type: DataTypes.STRING,
        field: "pic_url",
        comment: "切图地址",
      },
      isFiled: {
        type: DataTypes.INTEGER,
        field: "is_filed",
        comment: "是否归档 1已归档，0未归档 10:删除",
      },
      createUser: {
        type: DataTypes.STRING,
        field: "create_user",
        comment: "创建人姓名",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        comment: "创建时间",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        comment: "更新时间",
      },
    },
    {
      tableName: "prod_version_list",
      comment: "原型/UI表",
    }
  );
  return prod_version_list;
};
