import { describe, expect, it } from 'vitest';
import { ListValuePipe } from './list-value.pipe';

describe('ListValuePipe', () => {
  it('create an instance', () => {
    const pipe = new ListValuePipe();
    expect(pipe).toBeTruthy();
  });
});
