'use strict';

import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheModel from "../../interface/cache/ICacheModel";
import ICacheEntity from "../../interface/cache/ICacheEntity";
import CacheEntity from "../../entity/CacheEntity";
import ICacheModelOptions from "../../interface/cache/ICacheModelOptions";

import {createClient} from 'redis';
import ICacheRedisModelOptions from "../../interface/cache/ICacheRedisModelOptions";
import CacheBaseModel from "./CacheBaseModel";


class CacheRedisModel extends CacheBaseModel {
    private client;

    constructor(options: ICacheRedisModelOptions) {
        super(options);
        let url = `redis://`;
        if (options.connection.username) {
            url += `${options.connection.username}:${options.connection.password}@`;
        }
        if (options.connection.host) {
            url += `${options.connection.host}`;
        } else {
            url += `localhost`;
        }
        if (options.connection.port) {
            url += `:${options.connection.port}`;
        } else {
            url += `:6379`;
        }
        this.client = createClient({
            url,
        });
        this.client.connect();
    }

    async fetch(id: number | string, options: ICacheOptions): Promise<CacheEntity> {
        let data = await this.client.get(id);
        const decoded = this.decode(data, options);
        return decoded;
    }

    /**
     *
     * @param id
     * @param data
     * @param options
     */
    async set(id: number | string, data: ICacheEntity, options: ICacheOptions) {
        const serialized = this.encode(data, options);
        await this.client.set(id, serialized, {
            EX: data.ttl,
        });
    }

    async invalidateAll() {
        let p = [];
        const keys = await this.client.sendCommand(["keys", `${this.options.prefix}::*`]);
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            p.push(new Promise(async (res, rej) => {
                await this.invalidate(key);
                res();
            }));
        }
        await Promise.all(p);
    }

    async invalidate(id: number | string) {
        await this.client.sendCommand(['DEL', id]);
    }

    async disconnect() {
        await this.client.disconnect();
    }
}

export default CacheRedisModel;
