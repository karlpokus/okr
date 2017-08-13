#!/usr/bin/env node

function read() {
  try {
    return require(path.join(process.cwd(), args.f));
  } catch(e) {
    throw new Error('Wrong filepath or file argument missing');
  }
}

function parse(file) {
  return [...title(file), ...bodies(file), ...summary(file)].join('\n\r')
}

function title(file) {
  const timeFrame = file.timeFrame || 'forever',
        employee = file.employee || 'john doe';

  return [`\n\rOKR for ${chalk.blue(employee)} re ${chalk.blue(timeFrame)}\n\r`];
}

function createTable(okr) {
  let t = new Table();
  okr.krs.forEach(o => {
    t.cell(okr.o, o.k);
    t.cell('status', o.v === 'done'? chalk.green(o.v): o.v);
    t.newRow();
  });
  return t.toString();
}

function bodies(file) {
  return file.okrs.map(createTable);
}

function summary(file) {
  let n = 0, done = 0;

  file.okrs.forEach(okr => {
    okr.krs.forEach(krs => {
      n++;
      if (krs.v === 'done') { done++ };
    });
  });

  return [`summary ${done}/${n} done\n\r`];
}

function print(str) {
  console.log(str);
}

// globals
const args = require('minimist')(process.argv.slice(2)),
      path = require('path')
      chalk = require('chalk'),
      Table = require('easy-table'),
      pipe = (...fns) => fns.reduce((acc, fn) => fn(acc), null);

pipe(read, parse, print);
