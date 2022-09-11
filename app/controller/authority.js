'use strict';

const crypto = require('crypto');

const Controller = require('egg').Controller;
const moment = require('moment');
const generatePassword = require('password-generator');

class ClapAuthCtrl extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  async checkLogin(userCode, userPwd) {
    const error = { code: '0' };
    const record = await this.ctx.model.SysUser.findOne({ userCode }).catch(e => {
      if (e) error.code = '700';
    });
    if (!record) {
      error.code = '800';
      error.message = '抱歉，该用户不存在，请联系管理员！';
    } else if (record.userPwd !== crypto.createHash('md5').update(userPwd).digest('base64')) {
      error.code = '801';
      error.message = '抱歉！密码错误！';
    } else if (record.__s === 0) {
      error.code = '802';
      error.message = '抱歉，该用户已停用，请联系管理员！';
    }
    return { error, record };
  }

  async login() {
    let error = { code: '0' };
    const { userCode, userPwd } = this.ctx.request.body;
    if (!userCode) {
      error.code = '20201';
      error.message = 'param userCode missing';
    }
    if (!userPwd) {
      error.code = '20202';
      error.message = 'param userPwd missing';
    }
    let record = {};
    if (error.code === '0') {
      await this.checkLogin(userCode, userPwd).then(res => {
        error = res.error.code !== '0' ? res.error : error;
        record = res.error.code === '0' ? res.record : record;
      });
    }
    this.ctx.body = error.code === '0' ? {
      error,
      record,
    } : {
      error,
    };
  }

  async register() {
    const error = { code: '0' };
    const { userCode, userName, userPwd, organCode, organName } = this.ctx.request.body;
    if (!userCode) {
      error.code = '20201';
      error.message = 'param userCode missing';
    }
    if (!userPwd) {
      error.code = '20202';
      error.message = 'param userPwd missing';
    }
    let record;
    if (error.code === '0') {
      record = await this.ctx.model.SysUser.findOne({ userCode })
        .catch(e => {
          if (e) {
            error.code = '700';
          }
          console.info(e);
        });
      if (record) {
        error.code = '900';
        error.message = '用户已注册，请更换手机号重新注册！';
      }
      if (error.code === '0') {
        record = await this.ctx.model.SysUser.create({
          userCode,
          userName: userName ? userName : userCode,
          userPwd: crypto.createHash('md5')
            .update(userPwd)
            .digest('base64'),
        });
        if (organCode || organName) {
          record.registerOrgan = await this.ctx.model.OrgOrgan.create({ organCode, organName, license: moment().add(15, 'days') });
          record.registerOrganUser = await this.ctx.model.OrgOrganUser.create({ idOrgan: record.registerOrgan._id, idUser: record._id });
        }
      }
    }
    this.ctx.body = error.code === '0' ? {
      error,
      record,
    } : {
      error,
    };
  }

  async changePwd() {
    let error = { code: '0' };
    const { userCode, userPwd, userPwdNew } = this.ctx.request.body;
    if (!userCode) {
      error.code = '20201';
      error.message = 'param userCode missing';
    }
    if (!userPwd) {
      error.code = '20202';
      error.message = 'param userPwd missing';
    }
    if (!userPwdNew) {
      error.code = '20202';
      error.message = 'param userPwdNew missing';
    }
    if (error.code === '0') {
      await this.checkLogin(userCode, userPwd).then(res => {
        error = res.error.code !== '0' ? res.error : error;
      });
      if (error.code === '0') {
        await this.ctx.model.SysUser.updateOne({ userCode }, { userPwd: crypto.createHash('md5').update(userPwdNew).digest('base64') }).catch(e => {
          if (e) error.code = '700';
        });
      }
    }
    this.ctx.body = error.code === '0' ? {
      error,
    } : {
      error,
    };
  }

  async resetPwd() {
    const error = { code: '0' };
    const { userCode } = this.ctx.request.body;
    if (!userCode) {
      error.code = '20201';
      error.message = 'param userCode missing';
    }
    let record;
    if (error.code === '0') {
      record = { userPwd: generatePassword(6, false) };
      await this.ctx.model.SysUser.updateOne({ userCode }, { userPwd: crypto.createHash('md5').update(record.userPwd).digest('base64') }).catch(e => {
        if (e) error.code = '700';
      });
    }
    this.ctx.body = error.code === '0' ? {
      error,
      record,
    } : {
      error,
    };
  }

  async registerOrgan() {
    const error = {
      code: '0',
    };
    let record;
    const { ctx } = this,
        { organName, idUser } = this.ctx.request.body;
    if (!organName) {
      error.code = '504';
      error.message = '缺少参数 organName';
    }
    if (!idUser) {
      error.code = '504';
      error.message = '缺少参数 idUser';
    }
    if (error.code === '0') {
      const organ = await ctx.model.OrgOrgan.create({ organName });
      await ctx.model.OrgOrgan.updateMany({ _id: organ._id }, { idGroupOrgan: organ._id });
      if (organ) {
        const user = await ctx.model.SysUser.findOne({ _id: idUser });
        const admin = await ctx.model.OrgOrganUser.create({ idUser, name: user.userName, idOrgan: organ._id, userType: 'Admin', workNo: 'admin', __s: 1 });
        record = await ctx.model.OrgOrganUser.findOne({ _id: admin._id }).populate([ 'idOrgan' ]);
      } else {
        error.code = '500';
        error.message = '组织创建失败';
      }
    }
    this.ctx.body = error.code === '0' ? {
      error,
      record,
    } : {
      error,
    };
  }

  async registerByOrganUser() {
    const error = {
      code: '0',
    };
    let record;
    const { idOrganUser, userCode, userPwd = '123456' } = this.ctx.request.body;
    if (!idOrganUser) {
      error.code = '504';
      error.message = '缺少参数 idOrganUser';
    }
    if (error.code === '0') {
      const organUser = await this.ctx.model.OrgOrganUser.findOne({ _id: idOrganUser })
          .catch(e => {
            if (e) {
              error.code = '700';
            }
            console.info(e);
          });
      if (organUser.idUser) {
        error.code = '505';
        error.message = '该人员已绑定登录账号';
      } else {
        record = await this.ctx.model.SysUser.findOne({ userCode, userType: 'Default' }).lean();
        if (!record) {
          record = await this.ctx.model.SysUser.create({
            userCode,
            userName: organUser.name,
            userPwd: crypto.createHash('md5')
                .update(userPwd)
                .digest('base64'),
            userType: 'Default',
          }).catch(e => {
            if (e) {
              error.code = '700';
            }
            console.info(e);
          });
          await this.ctx.model.OrgOrganUser.updateMany({ _id: idOrganUser }, { idUser: record._id });
        } else {
          error.code = '505';
          error.message = '该登录账号已开通，请联系管理员绑定组织关系';
        }
      }
    }
    this.ctx.body = error.code === '0' ? {
      error,
      record,
    } : {
      error,
    };
  }
}

module.exports = ClapAuthCtrl;
