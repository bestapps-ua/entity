'use strict';

import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheEntity from "../../interface/cache/ICacheEntity";
import CacheEntity from "../../entity/CacheEntity";

import {createClient} from 'redis';
import ICacheRedisModelOptions from "../../interface/cache/ICacheRedisModelOptions";
import CacheBaseModel from "./CacheBaseModel";
import RegistryModel from "../RegistryModel";


class CacheRedisModel extends CacheBaseModel {
    private _client;

    constructor(options: ICacheRedisModelOptions) {
        super(options);
    }

    get client() {
        this._client = RegistryModel.get('redisClient');
        if (!this._client) {
            this.initRedisClient();
        }
        return this._client;
    }

    initRedisClient() {
        let url = `redis://`;
        if (this.options.connection.username) {
            url += `${this.options.connection.username}:${this.options.connection.password}@`;
        }
        if (this.options.connection.host) {
            url += `${this.options.connection.host}`;
        } else {
            url += `localhost`;
        }
        if (this.options.connection.port) {
            url += `:${this.options.connection.port}`;
        } else {
            url += `:6379`;
        }
        this._client = createClient({
            url,
        });
        this._client.connect();
        RegistryModel.set('redisClient', this._client);
    }

    async fetch(id: number | string, options: ICacheOptions): Promise<CacheEntity> {
        let data = await this.client.get(id);
        try {
            const decoded = this.decode(data, options);
            return decoded;
        }catch(e){
            console.log('error redis decode', e, data);
        }
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
                res(undefined);
            }));
        }
        await Promise.all(p);
    }

    async invalidate(id: number | string) {
        await this.client.sendCommand(['DEL', id]);
    }

    async disconnect() {
        this.client.disconnect();
    }
}

export default CacheRedisModel;
