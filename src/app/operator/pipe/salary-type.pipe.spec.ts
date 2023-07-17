import { SalaryTypePipe } from './salary-type.pipe';

describe('SalaryTypePipe', () => {
  it('create an instance', () => {
    const pipe = new SalaryTypePipe();
    expect(pipe).toBeTruthy();
  });
});
