// 登录
module.exports.login = async (data) => {
  const result =[null,null]
  await global.sequelize.query(
      `SELECT e.id, user_name, user_name_cn, jurisdiction, user_type, user_line_type, type_name FROM user AS e INNER JOIN user_type AS d ON e.user_type=d.id AND 
      ${/.com$|.con$/.test(data.user_name) ? "email" : "user_name"}="${data.user_name}" AND password="${data.password}"`,
      { type: global.sequelize.QueryTypes.SELECT }
    ).then(async function (results) {
      let item = results[0];
      if (item) {
        let line_type = item.user_line_type;
        const line_list = await global.sequelize.query(
            `SELECT id, type_name FROM line_type WHERE id IN(${line_type})`,
            { type: global.sequelize.QueryTypes.SELECT }
          ).then((results) => results).catch((err)=>{
            result[1] = err
          });
        item.line_list = line_list;
      }
      result[0] = item
    }).catch((err)=>{
      result[1] = err
    });

  console.log("-----result---", result);

  return result;
};

// 重置密码
module.exports.resetPassword = async (data) => {
  const result = await utils.awaitWrap( global.sequelize.query(
    `UPDATE user SET password='${data.new_password}' WHERE ${/.com$|.con$/.test(data.user_name) ? 'email' : 'user_name'}="${data.user_name}" AND password="${data.password}" `,
    { type: global.sequelize.QueryTypes.UPDATE }
  ), true);
  return result;
};

// 获取用户列表
module.exports.getUsersList = async (data) => {
  const result = await utils.awaitWrap( global.sequelize.query(`SELECT a.id, user_name, user_name_cn, user_type, type_name, user_line_type FROM user AS a LEFT JOIN user_type AS b ON a.user_type=b.id WHERE a.user_line_type LIKE '%${data.line_type}%'`, {type: global.sequelize.QueryTypes.SELECT}))
  return result;
};

