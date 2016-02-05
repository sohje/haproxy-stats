'use strict';
var parse = require('csv').parse;
var request = require('request');

var haFormat = [
    'pxname', 'svname', 'qcur', 'qmax', 'scur', 'smax', 'slim', 'stot', 'bin', 'bout','dreq',
    'dresp', 'ereq', 'econ', 'eresp', 'wretr', 'wredis', 'status', 'weight', 'act', 'bck',
    'chkfail', 'chkdown', 'lastchg', 'downtime', 'qlimit', 'pid', 'iid', 'sid', 'throttle',
    'lbtot', 'tracked', 'type', 'rate', 'rate_lim', 'rate_max', 'check_status', 'check_code',
    'check_duration', 'hrsp_1xx', 'hrsp_2xx', 'hrsp_3xx', 'hrsp_4xx', 'hrsp_5xx', 'hrsp_other',
    'hanafail', 'req_rate', 'req_rate_max', 'req_tot', 'cli_abrt', 'srv_abrt', 'comp_in', 'comp_out',
    'comp_byp', 'comp_rsp', 'lastsess', 'last_chk', 'last_agt', 'qtime', 'ctime', 'rtime','ttime'
];


module.exports = function(url, cb) {
    if (typeof url !== 'string') {
        throw new Error('Provide correct HAProxy\'s stats url');
    }

    if (typeof cb !== 'function') {
        throw new Error('Provide callback function');
    }

    function parseCSV(err, data) {
        var result = {};

        function makeResult(row, i, arr) {
            if (row[0] === '# pxname') return;
            if (!result[row[0]]) result[row[0]] = {}

            result[row[0]][row[1]] = {}
            haFormat.forEach(function(item, i, arr) {
                // fix this
                if (i < 2) return;
                result[row[0]][row[1]][item] = row[i]
            })
        }
        data.forEach(makeResult)
        cb(err, result)
    }

    request(url, function (err, resp, body) {
        if (!err && resp.statusCode == 200) {
            parse(body, {skip_empty_lines: true}, parseCSV);
        } else {
            cb(err || new Error(resp.statusCode), null)
        }
    })
}
