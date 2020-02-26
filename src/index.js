module.exports = class {
	constructor (entities) {
		this._entities = entities
	}

	/** used by list-entities. Returns all entities with order and pagination */
	async searchAll (page, pageSize, sort, inputSearch) {
		this._orderBy(this._entities, sort)
		const entities = this._paginate(this._entities, page, pageSize)
		return {
			count: this._entities.length,
			entities: entities
		}
	}

	/** used by list-entities. Returns entities filtered by a specific attribute */
	async searchAttr (page, pageSize, sort, inputSearch, paramsRequest, params) {
		params = params.slice()
		params.push.apply(params, paramsRequest)
		let entities = this._filter(this._entities, params, inputSearch)
		this._orderBy(entities, sort)
		entities = this._paginate(entities, page, pageSize)
		return {
			count: entities.length,
			entities: entities
		}
	}

	/** used by list-entities. Returns filtered entities based on all attributes */
	async searchDefault (page, pageSize, sort, inputSearch, paramsRequest, params) {
		let entities = this._filter(this._entities, paramsRequest, inputSearch)
		entities = this._filterOr(entities, params, inputSearch)
		this._orderBy(entities, sort)
		entities = this._paginate(entities, page, pageSize)
		return {
			count: entities.length,
			entities: entities
		}
	}

	/** used by list-entities. Remove a specific entity */
	async delete (id, entity, index, entities) {
		this._entities.splice(index, 1)
	}

	/** NOT used by list-entities. Sort a entity list by an attribute (+${attr} or -${attr}) */
	_orderBy (entities, sort) {
		let signal
		let attr

		if (sort[0] === '-' || sort[0] === '+') {
			signal = sort[0]
			attr = sort.substring(1)
		} else {
			signal = '+'
			attr = sort
		}

		if (signal === '+')
			signal = 1
		else
			signal = -1

		entities.sort((a, b) => (a[attr] < b[attr]) ? -1 * signal : 1 * signal)
	}

	/** NOT used by list-entities. Returns a list of entities on the correct page */
	_paginate (entities, page, pageSize) {
		return entities.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
	}

	/** NOT used by list-entities. Search for entities that match user filters */
	_filter (entities, params, inputSearch) {
		return entities.filter(entity => this._entityVerify(entity, params, inputSearch))
	}

	/** NOT used by list-entities. Search for entities that match any of the filters */
	_filterOr (entities, params, inputSearch) {
		return entities.filter(entity => this._entityVerifyOr(entity, params, inputSearch))
	}

	/** NOT used by list-entities. Returns true if the entity matches any of the filters */
	_entityVerifyOr (entity, params, inputSearch) {
		return params.reduce((valid, and) => {
			if (valid) return true
			return this._entityVerify(entity, and, inputSearch)
		}, false)
	}

	/** NOT used by list-entities. Returns true if the entity matches the filters provided */
	_entityVerify (entity, params, inputSearch) {
		return params.reduce((valid, param) => {
			if (!valid)
				return false

			if (param.operator === '$' && param.descriptor.type === String)
				param.operator = '$in'

			let attrValue

			if (entity instanceof Array && param.attr.match(/\./)) {
				const attr = param.attr.split('.').slice(1).join('.')
				attrValue = entity.genres.map(g => this._getAttr(attr, entity))
			} else {
				attrValue = entity[param.attr]
			}

			if (param.descriptor.searchSepAnd && inputSearch.match(param.descriptor.searchSepAnd)) {
				const values = param.value.split(param.descriptor.searchSepAnd)
					.map(value => this._verify(attrValue, param.operator, value))

				return values.reduce((p, valid) => p && valid, true)
			} else if (param.descriptor.searchSepOr && inputSearch.match(param.descriptor.searchSepOr)) {
				const values = param.value.split(param.descriptor.searchSepOr)
					.map(value => this._verify(attrValue, param.operator, value))

				return values.reduce((p, valid) => p || valid, false)
			}

			return this._verify(attrValue, param.operator, param.value)
		}, true)
	}

	/** NOT used by list-entities. Performs a logical comparison between two values through an operator */
	_verify (value1, operator, value2) {
		if (value1 instanceof Array) {
			let cmp = (p, n) => p || n
			let initc = false

			if (operator.startsWith('$n')) {
				cmp = (p, n) => p && n
				initc = true
			}

			return value1.map(v => this._verify(v, operator, value2))
				.reduce((p, n) => cmp(p, n), initc)
		}

		if (value1 instanceof Date)
			value1 = value1.getTime()

		if (value2 instanceof Date)
			value2 = value2.getTime()

		if (operator === '$') // if an operator has not been selected
			operator = '$eq'

		switch (operator) {
		case '$in': return value1.match(new RegExp(this._scape(value2), 'i'))
		case '$nin': return !value1.match(new RegExp(this._scape(value2), 'i'))
		case '$eq': return `${value1}` === `${value2}`
		case '$neq': return `${value1}` !== `${value2}`
		case '$sw': return value1.startsWith(value2)
		case '$nsw': return !value1.startsWith(value2)
		case '$ew': return value1.endsWith(value2)
		case '$new': return !value1.endsWith(value2)
		case '$gt': {
			if (typeof value1 === 'number' || typeof value2 === 'number') {
				value1 = parseFloat(value1)
				value2 = parseFloat(value2)
			}

			if (Object.is(value1, NaN) || Object.is(value2, NaN))
				return false

			return value1 > value2
		}
		case '$gte': {
			if (typeof value1 === 'number' || typeof value2 === 'number') {
				value1 = parseFloat(value1)
				value2 = parseFloat(value2)
			}

			if (Object.is(value1, NaN) || Object.is(value2, NaN))
				return false

			return value1 >= value2
		}
		case '$lt': {
			if (typeof value1 === 'number' || typeof value2 === 'number') {
				value1 = parseFloat(value1)
				value2 = parseFloat(value2)
			}

			if (Object.is(value1, NaN) || Object.is(value2, NaN))
				return false

			return value1 < value2
		}
		case '$lte': {
			if (typeof value1 === 'number' || typeof value2 === 'number') {
				value1 = parseFloat(value1)
				value2 = parseFloat(value2)
			}

			if (Object.is(value1, NaN) || Object.is(value2, NaN))
				return false

			return value1 <= value2
		}
		default: return false
		}
	}

	/** NOT used by list-entities. Returns string with special regular expression characters with escape */
	_scape (str) {
		return str.replace(/[.*+?^${}()|[]\]/g, '\$&')
	}

	/**
	 * NOT used by list-entities
	 * Gets the value of an object through its path
	 * @param {string} pathAttr - Attribute path containing desired value
	 * @param {Object} obj - Object containing desired attribute
	 * @param {boolean} [searchArray] - If true, the attributes that are array will recursively call this function at each value present in the array and throw the result of each position into another array that will be returned. If false, arrays are considered objects and their positions are considered attributes. Default value: false
	 * @returns {any} Value of an object through its path
	 *
	 * @example
	 * let obj = {
	 *     a: {
	 *         b: 1,
	 *         c: 2
	 *     },
	 *
	 *     b: [
	 *         { d: 3, e: 4 },
	 *         { d: 5, e: 6 },
	 *         { f: 7, g: 8, z: [{ info: '123' }] }
	 *     ]
	 * }
	 *
	 * _getAttr('a.b', obj) // 1
	 * _getAttr('a.c', obj) // 2
	 * _getAttr('b.2.f', obj) // 7
	 * _getAttr('b.2.g', obj) // 8
	 *
	 * _getAttr('b.d', obj, true) // [3,5,undefined]
	 * _getAttr('b.e', obj, true) // [4,6,undefined]
	 * _getAttr('b.z.info', obj, true) // [undefined, undefined, ['123']]
	 */
	_getAttr (pathAttr, obj, searchArray = false) {
		if (!obj) {
			return obj
		}

		if (!pathAttr) {
			return null
		}

		if (searchArray && obj instanceof Array) {
			const rt = []

			for (const v of obj) {
				rt.push(this._getAttr(pathAttr, v, searchArray))
			}

			return rt
		}

		if (pathAttr.match(/\./)) {
			const pathAttrArray = pathAttr.split('.')
			const pathRemaning = pathAttrArray.slice(1).join('.')
			const attr = pathAttrArray[0]
			const value = obj[attr]

			if (searchArray && value instanceof Array) {
				const rt = []
				for (const v of value) {
					rt.push(this._getAttr(pathRemaning, v, searchArray))
				}
				return rt
			} else {
				return this._getAttr(pathRemaning, value, searchArray)
			}
		} else {
			const value = obj[pathAttr]

			if (searchArray && value instanceof Array) {
				const rt = []
				for (const v of value) {
					rt.push(v)
				}
				return rt
			} else {
				return value
			}
		}
	}
}
