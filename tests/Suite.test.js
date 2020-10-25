const assert = require('assert');
const { describe, NullReporter, Suite, Test } = require('..');

describe('Suites', ({ it, xit }) => {

  const reporter = new NullReporter();

  it('should report successful tests', async () => {
    const test1 = new Test('should run test 1', pass);
    const test2 = new Test('should run test 2', pass);
    const suite = new Suite('Test Suite').add(test1, test2);

    await suite.run(reporter);

    assert.equal(suite.passed, true);
    assert.equal(test1.passed, true);
    assert.equal(test2.passed, true);
  });

  it('should report failing tests', async () => {
    const test1 = new Test('should run test 1', pass);
    const test2 = new Test('should run test 2', fail);
    const suite = new Suite('Test Suite').add(test1, test2);

    await suite.run(reporter);

    assert.equal(suite.failed, true);
    assert.equal(test1.passed, true);
    assert.equal(test2.failed, true);
  });

  it('should skip tests (runner)', async () => {
    const test1 = new Test('should run test 1', pass);
    const test2 = new Test('should run test 2', fail);
    const suite = new Suite('Test Suite').add(test1, test2);

    await suite.run(reporter, { skip: true });

    assert.equal(suite.skipped, true);
    assert.equal(test1.skipped, true);
    assert.equal(test2.skipped, true);
  });

  it('should skip tests (configuration)', async () => {
    const test1 = new Test('should run test 1', pass);
    const test2 = new Test('should run test 2', fail);
    const suite = new Suite('Test Suite', { skip: true }).add(test1, test2);

    await suite.run(reporter);

    assert.equal(suite.skipped, true);
    assert.equal(test1.skipped, true);
    assert.equal(test2.skipped, true);
  });

  it('should skip tests (individual)', async () => {
    const test1 = new Test('should run test 1', pass);
    const test2 = new Test('should run test 2', pass, { skip: true });
    const suite = new Suite('Test Suite').add(test1, test2);

    await suite.run(reporter);

    assert.equal(suite.passed, true);
    assert.equal(test1.passed, true);
    assert.equal(test2.skipped, true);
  });

  it('should abort early (runner)', async () => {
    const test1 = new Test('should run test 1', fail);
    const test2 = new Test('should run test 2', pass);
    const suite = new Suite('Test Suite').add(test1, test2);

    await suite.run(reporter, { abort: true });

    assert.equal(suite.failed, true);
    assert.equal(test1.failed, true);
    assert.equal(test2.skipped, true);
  });

  it('should aborting early (configuration)', async () => {
    const test1 = new Test('should run test 1', fail);
    const test2 = new Test('should run test 2', pass);
    const suite = new Suite('Test Suite', { abort: true }).add(test1, test2);

    await suite.run(reporter);

    assert.equal(suite.failed, true);
    assert.equal(test1.failed, true);
    assert.equal(test2.skipped, true);
  });

  it('should support nesting', async () => {
    const parent = new Suite('Parent');
    const child1 = new Suite('Child 1');
    const child2 = new Suite('Child 2');
    const test1 = new Test('Test 1', pass);
    const test2 = new Test('Test 2', fail);
    const test3 = new Test('Test 3', pass);
    child1.add(test1, test2);
    child2.add(test3);
    parent.add(child1, child2);

    await parent.run(reporter);

    assert.equal(parent.passed, false);
    assert.equal(parent.name, 'Parent');

    assert.equal(child1.name, 'Child 1');
    assert.equal(child1.passed, false);
    assert.equal(test1.name, 'Test 1');
    assert.equal(test1.passed, true);
    assert.equal(test2.name, 'Test 2');
    assert.equal(test2.failed, true);

    assert.equal(child2.name, 'Child 2');
    assert.equal(child2.passed, true);
    assert.equal(test3.name, 'Test 3');
    assert.equal(test3.passed, true);
  });
});

function pass() {
  return Promise.resolve();
}

function fail() {
  return new Promise((resolve, reject) => reject(new Error('Oh Noes!')));
}
