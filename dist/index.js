"use strict";

require("core-js/modules/es6.promise.js");

require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.regexp.replace.js");

require("core-js/modules/es6.object.is.js");

require("core-js/modules/es6.string.ends-with.js");

require("core-js/modules/es6.regexp.constructor.js");

require("core-js/modules/es6.string.starts-with.js");

require("core-js/modules/es6.regexp.split.js");

require("core-js/modules/es6.regexp.match.js");

require("core-js/modules/es6.function.name.js");

require("core-js/modules/es6.array.sort.js");

require("regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function _class(entities) {
    _classCallCheck(this, _class);

    this._entities = entities;
  }
  /** used by list-entities. Returns all entities with order and pagination */


  _createClass(_class, [{
    key: "searchAll",
    value: function () {
      var _searchAll = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(page, pageSize, sort, inputSearch) {
        var entities;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._orderBy(this._entities, sort);

                entities = this._paginate(this._entities, page, pageSize);
                return _context.abrupt("return", {
                  count: this._entities.length,
                  entities: entities
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function searchAll(_x, _x2, _x3, _x4) {
        return _searchAll.apply(this, arguments);
      }

      return searchAll;
    }()
    /** used by list-entities. Returns entities filtered by a specific attribute */

  }, {
    key: "searchAttr",
    value: function () {
      var _searchAttr = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(page, pageSize, sort, inputSearch, paramsRequest, params) {
        var entities;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                params = params.slice();
                params.push.apply(params, paramsRequest);
                entities = this._filter(this._entities, params, inputSearch);

                this._orderBy(entities, sort);

                entities = this._paginate(entities, page, pageSize);
                return _context2.abrupt("return", {
                  count: entities.length,
                  entities: entities
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function searchAttr(_x5, _x6, _x7, _x8, _x9, _x10) {
        return _searchAttr.apply(this, arguments);
      }

      return searchAttr;
    }()
    /** used by list-entities. Returns filtered entities based on all attributes */

  }, {
    key: "searchDefault",
    value: function () {
      var _searchDefault = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(page, pageSize, sort, inputSearch, paramsRequest, params) {
        var entities;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                entities = this._filter(this._entities, paramsRequest, inputSearch);
                entities = this._filterOr(entities, params, inputSearch);

                this._orderBy(entities, sort);

                entities = this._paginate(entities, page, pageSize);
                return _context3.abrupt("return", {
                  count: entities.length,
                  entities: entities
                });

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function searchDefault(_x11, _x12, _x13, _x14, _x15, _x16) {
        return _searchDefault.apply(this, arguments);
      }

      return searchDefault;
    }()
    /** used by list-entities. Remove a specific entity */

  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(id, entity, index, entities) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this._entities.splice(index, 1);

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _delete(_x17, _x18, _x19, _x20) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
    /** NOT used by list-entities. Sort a entity list by an attribute (+${attr} or -${attr}) */

  }, {
    key: "_orderBy",
    value: function _orderBy(entities, sort) {
      var signal;
      var attr;

      if (sort[0] === '-' || sort[0] === '+') {
        signal = sort[0];
        attr = sort.substring(1);
      } else {
        signal = '+';
        attr = sort;
      }

      if (signal === '+') signal = 1;else signal = -1;
      entities.sort(function (a, b) {
        return a[attr] < b[attr] ? -1 * signal : 1 * signal;
      });
    }
    /** NOT used by list-entities. Returns a list of entities on the correct page */

  }, {
    key: "_paginate",
    value: function _paginate(entities, page, pageSize) {
      return entities.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    }
    /** NOT used by list-entities. Search for entities that match user filters */

  }, {
    key: "_filter",
    value: function _filter(entities, params, inputSearch) {
      var _this = this;

      return entities.filter(function (entity) {
        return _this._entityVerify(entity, params, inputSearch);
      });
    }
    /** NOT used by list-entities. Search for entities that match any of the filters */

  }, {
    key: "_filterOr",
    value: function _filterOr(entities, params, inputSearch) {
      var _this2 = this;

      return entities.filter(function (entity) {
        return _this2._entityVerifyOr(entity, params, inputSearch);
      });
    }
    /** NOT used by list-entities. Returns true if the entity matches any of the filters */

  }, {
    key: "_entityVerifyOr",
    value: function _entityVerifyOr(entity, params, inputSearch) {
      var _this3 = this;

      return params.reduce(function (valid, and) {
        if (valid) return true;
        return _this3._entityVerify(entity, and, inputSearch);
      }, false);
    }
    /** NOT used by list-entities. Returns true if the entity matches the filters provided */

  }, {
    key: "_entityVerify",
    value: function _entityVerify(entity, params, inputSearch) {
      var _this4 = this;

      return params.reduce(function (valid, param) {
        if (!valid) return false;
        if (param.operator === '$' && param.descriptor.type === String) param.operator = '$in';
        var attrValue;
        if (param.attr === 'genres.name') attrValue = entity.genres.map(function (g) {
          return g.name;
        });else attrValue = entity[param.attr];

        if (param.descriptor.searchSepAnd && inputSearch.match(param.descriptor.searchSepAnd)) {
          var values = param.value.split(param.descriptor.searchSepAnd).map(function (value) {
            return _this4._verify(attrValue, param.operator, value);
          });
          return values.reduce(function (p, valid) {
            return p && valid;
          }, true);
        } else if (param.descriptor.searchSepOr && inputSearch.match(param.descriptor.searchSepOr)) {
          var _values = param.value.split(param.descriptor.searchSepOr).map(function (value) {
            return _this4._verify(attrValue, param.operator, value);
          });

          return _values.reduce(function (p, valid) {
            return p || valid;
          }, false);
        }

        return _this4._verify(attrValue, param.operator, param.value);
      }, true);
    }
    /** NOT used by list-entities. Performs a logical comparison between two values through an operator */

  }, {
    key: "_verify",
    value: function _verify(value1, operator, value2) {
      var _this5 = this;

      if (value1 instanceof Array) {
        var cmp = function cmp(p, n) {
          return p || n;
        };

        var initc = false;

        if (operator.startsWith('$n')) {
          cmp = function cmp(p, n) {
            return p && n;
          };

          initc = true;
        }

        return value1.map(function (v) {
          return _this5._verify(v, operator, value2);
        }).reduce(function (p, n) {
          return cmp(p, n);
        }, initc);
      }

      if (value1 instanceof Date) value1 = value1.getTime();
      if (value2 instanceof Date) value2 = value2.getTime();
      if (operator === '$') // if an operator has not been selected
        operator = '$eq';

      switch (operator) {
        case '$in':
          return value1.match(new RegExp(this._scape(value2), 'i'));

        case '$nin':
          return !value1.match(new RegExp(this._scape(value2), 'i'));

        case '$eq':
          return "".concat(value1) === "".concat(value2);

        case '$neq':
          return "".concat(value1) !== "".concat(value2);

        case '$sw':
          return value1.startsWith(value2);

        case '$nsw':
          return !value1.startsWith(value2);

        case '$ew':
          return value1.endsWith(value2);

        case '$new':
          return !value1.endsWith(value2);

        case '$gt':
          {
            if (typeof value1 === 'number' || typeof value2 === 'number') {
              value1 = parseFloat(value1);
              value2 = parseFloat(value2);
            }

            if (Object.is(value1, NaN) || Object.is(value2, NaN)) return false;
            return value1 > value2;
          }

        case '$gte':
          {
            if (typeof value1 === 'number' || typeof value2 === 'number') {
              value1 = parseFloat(value1);
              value2 = parseFloat(value2);
            }

            if (Object.is(value1, NaN) || Object.is(value2, NaN)) return false;
            return value1 >= value2;
          }

        case '$lt':
          {
            if (typeof value1 === 'number' || typeof value2 === 'number') {
              value1 = parseFloat(value1);
              value2 = parseFloat(value2);
            }

            if (Object.is(value1, NaN) || Object.is(value2, NaN)) return false;
            return value1 < value2;
          }

        case '$lte':
          {
            if (typeof value1 === 'number' || typeof value2 === 'number') {
              value1 = parseFloat(value1);
              value2 = parseFloat(value2);
            }

            if (Object.is(value1, NaN) || Object.is(value2, NaN)) return false;
            return value1 <= value2;
          }

        default:
          return false;
      }
    }
    /** NOT used by list-entities. Returns string with special regular expression characters with escape */

  }, {
    key: "_scape",
    value: function _scape(str) {
      return str.replace(/[.*+?^${}()|[]\]/g, '\$&');
    }
  }]);

  return _class;
}();