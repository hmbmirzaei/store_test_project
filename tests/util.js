const { check_id } = require('../controller/util');
const funcs = {
    iD: value => expect(check_id(value)).toBe(true),
    num: value => expect(value).toEqual(expect.any(Number)),
    str: value => expect(value).toEqual(expect.any(String)),
    num_null: value => expect(value).toEqual(expect.toBeOneOf([expect.any(Number), null])),
    str_null: value => expect(value).toEqual(expect.toBeOneOf([expect.any(String), undefined, null])),
    str_num_null: value => expect(value).toEqual(expect.toBeOneOf([expect.any(Number), expect.any(String), null])),
    id_null: value => {
        if (value == null)
            return true
        funcs.iD(value)
    },
    bool_null: value => expect(value).toEqual(expect.toBeOneOf([true, false, null, undefined])),
    date: value => expect(value).toEqual(expect.any(Date)),
    date_null: value => expect(value).toEqual(expect.toBeOneOf([expect.any(Date), null])),
    check_id
}
module.exports = funcs