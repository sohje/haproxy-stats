import test from 'ava';
import hastats from './index.js';

test(t => {
    t.plan(2);
    t.throws(hastats, "Provide correct HAProxy's stats url")
    t.throws(hastats.bind(null, 'http://localhost/'), "Provide callback function")
})

test.cb(t => {
    t.plan(2);
    hastats('http://localhost/', function(err, data) {
        t.notOk(data);
        t.ifError(!err);
        t.end();
    })
})