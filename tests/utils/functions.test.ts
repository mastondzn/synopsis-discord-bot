import { exponentiate } from '../../src/utils/functions';

test('exponentiate 3^2 to equal 9', () => {
    expect(exponentiate(3, 2)).toBe(9);
});
