const path = require('path');
const { MultiReporter, ConsoleReporter, TapReporter } = require('..');

const filename = path.resolve(__dirname, process.argv[2]);
const runnable = require(filename);

const reporter = new MultiReporter()
  .add(new ConsoleReporter())
  .add(new TapReporter());

runnable.run(reporter).then(() => {
  if (runnable.failed) process.exit(1);
})