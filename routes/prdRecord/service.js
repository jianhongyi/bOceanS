const moment = require("moment");
const uuid = require("node-uuid");

// 创建一个产品
module.exports.creatProd = async (data) => {
  const result = await utils.awaitWrap(global.sequelize
    .query(
      `INSERT INTO prod_list(line_type, prod_name, created_at, updated_at) VALUES(${
        data.line_type
      }, '${data.prod_name}', '${moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`,
      { type: global.sequelize.QueryTypes.INSERT }
    ))
  return result;
};

// 上传完UI后更新产品首页图片
module.exports.upLoadProdImg = async (url, prod_id) => {
  const result = await utils.awaitWrap(global.sequelize
    .query(`UPDATE prod_list SET prod_img='${url}' WHERE id=${prod_id}`,
      { type: global.sequelize.QueryTypes.UPDATE }
    ), true)
  return result;
}

// 获取产品线对应的产品列表
module.exports.getProdList = async (data) => {
  const result = await utils.awaitWrap(global.sequelize
    .query(`SELECT * FROM prod_list WHERE line_type=${data.line_type}`, {
      type: global.sequelize.QueryTypes.SELECT,
    }))
  return result;
};

// 根据用户id获取email
module.exports.getUsersListID = async (data) => {
  const result = await utils.awaitWrap(global.sequelize
    .query(
      `SELECT id, user_name, email FROM user WHERE user_line_type LIKE '%${data.line_type}%' AND id in(${data.notify_obj})`,
      { type: global.sequelize.QueryTypes.SELECT }
    ))
  return result;
};

// 查询文件列表
module.exports.getRecordList = async (data) => {
  const result = await utils.awaitWrap(global.sequelize.query(`SELECT * FROM prod_version_list WHERE prod_id='${data.prod_id}' AND is_filed=0 AND prd_type=${data.prd_type} ORDER BY created_at DESC`,{type: global.sequelize.QueryTypes.SELECT}))
  return result;
};


// 保存
module.exports.saveRecord = async (data) => {
  const result = await utils.awaitWrap( global.sequelize
  .query(
    `INSERT INTO prod_version_list(prd_id,prd_name,prd_type,file_name, file_url, pic_url, prod_id, is_filed, create_user, created_at, updated_at) 
     VALUES('${data.prd_id || uuid.v1()}', '${data.prd_name}','${data.prd_type}','${data.file_name}','${data.fileUrl}','${data.picUrl}','${data.prod_id}','${data.is_filed}', '${data.userInfo.userName}', 
    '${moment().format( "YYYY-MM-DD HH:mm:ss")}', '${moment().format("YYYY-MM-DD HH:mm:ss")}')`,
    { type: global.sequelize.QueryTypes.INSERT }
  ), true)
  return result;
};

// 更新UI切图
module.exports.uploadPic = async (data) => {
  let result = await utils.awaitWrap( global.sequelize.query(`UPDATE prod_version_list SET pic_url='${data.file_url}', updated_at='${moment().format("YYYY-MM-DD HH:mm:ss")}' WHERE prd_id='${data.prd_id}'`));
  return result;
};

// 更新文件属性 isFiled 是否归档
module.exports.updateIsFiled = async (data) => {
  const result = await utils.awaitWrap( global.sequelize.query(`UPDATE prod_version_list SET is_filed=${data.is_filed} WHERE id=${data.id}`,{type: global.sequelize.QueryTypes.UPDATE}), true);
  return result;
};

