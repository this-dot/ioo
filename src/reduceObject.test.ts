'use strict';

import 'jest';
// tslint:disable-next-line:no-unused-expression
import 'babel-core/register';
// tslint:disable-next-line:no-unused-expression
import 'babel-polyfill';

import reduceObject from './reduceObject';

describe('reduceObject', () => {
  let original = { small: 1, smallish: 2, big: 4 };
  let callback;
  let result;

  describe('callback use', () => {
    beforeEach(() => {
      callback = jest
        .fn()
        .mockReturnValueOnce({ SMALL: 10 })
        .mockReturnValueOnce({ SMALL: 10, SMALLISH: 20 })
        .mockReturnValueOnce({ SMALL: 10, SMALLISH: 20, BIG: 40 });
      result = reduceObject(original, callback);
    });
    it('was called three times', () => {
      expect(callback.mock.calls.length).toEqual(3);
    });
    it('returned the last return value', () => {
      expect(result).toEqual({ SMALL: 10, SMALLISH: 20, BIG: 40 });
    });
    it('was invoked with expected arguments', () => {
      expect(callback.mock.calls[0]).toEqual([{}, 'small', 1]);
      expect(callback.mock.calls[1]).toEqual([{ SMALL: 10 }, 'smallish', 2]);
      expect(callback.mock.calls[2]).toEqual([
        { SMALL: 10, SMALLISH: 20 },
        'big',
        4,
      ]);
    });
  });

  describe('result', () => {
    beforeEach(() => {
      result = reduceObject(original, (acc, key: string, value: any) => {
        return {
          ...acc,
          [key.toUpperCase()]: value * 10,
        };
      });
    });

    it('returned a new object', () => {
      expect(result).not.toEqual(original);
    });

    it('returned expected result', () => {
      expect(result).toEqual({
        BIG: 40,
        SMALL: 10,
        SMALLISH: 20,
      });
    });
  });
});
