"use strict";
const service = require("./service");
/* global utils */

/**
 * @api {get} 根据产品线获取产品列表
 * req: {line_type: 产品线id}
 */
module.exports.getProdList = async (ctx) => {
  let req = utils.analysisParams(ctx.request.url);
  let [Data, err] = await service.getProdList(req);
  if (Data) {
    ctx.state.data = Data;
  }else{
    utils.serverErrTip(ctx, err)
  }
};

/**
 * @api {post} 创建产品
 * req: {line_type: 产品线id, prod_name: 产品名, prod_img: 产品封面图}
 */
module.exports.creatProd = async (ctx) => {
  const params = ctx.request.body;
  let [Data, err] = await service.creatProd(params);
  if (Data) {
    ctx.state.data = true;
    ctx.state.tip = '创建成功';
  }else{
    utils.serverErrTip(ctx, err)
  }
};

/**
 * @api {POST} 根据产品id获取产品列表
 * req: {prod_id: 产品id}
 */
module.exports.getRecordList = async (ctx) => {
  let req = utils.analysisParams(ctx.request.url);
  let [Data, err] = await service.getRecordList(req);
  if (Data) {
    let result = {};
    Data.forEach((item) => {
      if (result[item.prd_id]) {
        result[item.prd_id].list.push(item);
        if(!result[item.prd_id].pic_url){
          result[item.prd_id].pic_url = item.pic_url
        }
      } else {
        const itemData = {
          create_user: item.create_user,
          prd_id: item.prd_id,
          prd_name: item.prd_name,
          pic_url: item.pic_url,
          list: [item],
        };
        result[item.prd_id] = itemData;
      }
    });
    ctx.state.data = Object.values(result);
  }else{
    utils.serverErrTip(ctx, err)
  }
};

/**
 * @api {POST} 保存/更新 产品版本
 * req:{line_type: 产品线id, notify_obj: 通知用户id}
 */
module.exports.saveRecord = async (ctx) => {
  let urlData = utils.analysisParams(ctx.request.url);
  urlData.userInfo = ctx.userData;
  let urlObj = await utils.regularFormImage(ctx.req, urlData);
  let [Data, err] = await service.saveRecord({
    ...urlData,
    fileUrl: urlObj.fileUrl,
    picUrl: urlObj.picUrl,
  });
  if(`${urlData.prd_type}` === '1'){ // 上传ui后需要更新首页的产品图片
    let url = urlObj.previewUrl
    await service.upLoadProdImg(url, urlData.prod_id);
  }
  if (Data) {
    console.log('Data', Data)
    urlData.file_url = urlObj.fileUrl
    urlData.isUploadPic = urlObj.picUrl ? 1 : 0
    urlData.prod_name = urlData.prod_name
    getSendEmail(urlData, Data);
    ctx.state.data = Data;
  }else{
    utils.serverErrTip(ctx, err)
  }
};

/**
 * @api {POST} 保存切图
 * req:{line_type: 产品线id, notify_obj: 通知用户id}
 */
module.exports.uploadPic = async (ctx) => {
  let urlData = utils.analysisParams(ctx.request.url);

  urlData.userInfo = ctx.userData;
  let fileUrl = await utils.saveImage(ctx.req, urlData);
  let [Data, err] = await service.uploadPic({
    ...urlData,
    file_url: fileUrl,
  });
  if (Data) {
    urlData.file_url = fileUrl
    urlData.isUploadPic = 1
    urlData.prod_name = urlData.prod_name
    getSendEmail(urlData);
    ctx.state.data = [];
  }else{
    utils.serverErrTip(ctx, err)
  }
};

/**
 * @api {POST} 更新文件的isFiled
 */
module.exports.updateIsFiled = async (ctx) => {
  let urlData = utils.analysisParams(ctx.request.url);
  let [Data, err] = await service.updateIsFiled(urlData);
  if (Data === 1) {
    ctx.state.data = '';
    ctx.state.tip = '修改成功';
  }else{
    utils.serverErrTip(ctx, err)
  }
};

/**
 * 
 * @param {*} 发送邮件
 * req{line_type: 产品线id, notify_obj: 通知人员id,以逗号隔开1,2,3,4, userInfo: 用户信息, prd_id: 产品版本id, prd_type: 文件类型,UI/原型, file_url: 文件路径 }
 */
async function getSendEmail(urlData) {
  let [Data, err] = await service.getUsersListID(urlData);
  if (Data) {
    let sendList = Data.map((element) => element.email);
    let sendemeail = sendList.toString();
    utils.toSendEmail(sendemeail, urlData);
  }else{
    utils.serverErrTip(ctx, err)
  }
}
