'use strict';

module.exports = {
  get collection() {
    return this.params.model ? this.model[this.helper.humps.pascalize(this.params.model)] : 'undefined';
  },
};
