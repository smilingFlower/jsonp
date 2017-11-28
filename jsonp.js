/**
 * Callback index.
 */

var count = 0;

/**
 * Noop function.
 */

function noop(){}

/**
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - timeout {Number} 多久是超时 (`60000`) 
 * 
 * @param {String} url 
 * @param {Object} options 
 * @param {Function} fn 
 */
function jsonp(url, options, fn) {
    
    if(typeof options === 'function') {
        fn = options
        options = {}
    }

    if (!options) {
        options = {}
    }

    // 回调涵数的前缀
    var prefix = options.prefix || ('__jp');
    // 回调函数名
    var id = (prefix + (count++));
    // 传参的key
    var param = options.param || 'callblack';
    //超时时间
    var timeout = options.timeout || 60000;

    var enc = encodeURIComponent;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;

    if (timeout) {
        timer = setTimeout(function() {
            cleanup()
            if (fn) fn(new Error('请求超时'));
        }, timeout)
    }

    window[id] = function(data){
        cleanup();
        if (fn) fn(null, data);
        if (timer) clearTimeout(timer);
    };

    function cleanup(){
        if (script.parentNode) script.parentNode.removeChild(script);
        if (window[id]) {
            window[id] = noop
        }
    }    

    url += (~url.indexOf('?') ? '&' : '?') + enc(param) + '=' + enc(id);
    url.replace('?&','?');

    //创建script    
    script = document.createElement("script");
    script.src = url
    target.parentNode.insertBefore(script, target)
}
