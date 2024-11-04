import Memcached from 'memcached';

var memcached = new Memcached("http://127.0.0.1:11211", { retries: 10, retry: 10000, remove: true, failOverServers: ['192.168.0.103:11211'] });

async function setAppCache(key: any, params: any) {
    memcached.set(key, params, 10000, (err: any, data: any) => {
        if (err) {
            throw new err
        }
        return;
    })
}

async function getAppCache(params: any) {
    memcached.get(params, (err: any, data: any) => {
        if (err) {
            throw new err
        }
        return data;
    })
}

function delCache(params: any) {
    memcached.del(params, (err: any, data: any) => {
        if (err) {
            throw new err
        }
    })
}

export {
    getAppCache,
    setAppCache,
    delCache
}