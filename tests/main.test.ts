import { add, subtract } from '../src/main';

test('add 2+4 to equal 6', () => {
    expect(add(2, 4)).toBe(6);
});

test('subtract 4-2 to equal 2', () => {
    expect(subtract(4, 2)).toBe(2);
});
