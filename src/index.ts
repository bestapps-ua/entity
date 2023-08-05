import _ICacheEntity from "./interface/cache/ICacheEntity";
import _ICacheFactoryModel from "./interface/cache/ICacheFactoryModel";
import _ICacheFactoryModelOptions from "./interface/cache/ICacheFactoryModelOptions";
import _ICacheModel from "./interface/cache/ICacheModel";
import _ICacheModelOptions from "./interface/cache/ICacheModelOptions";
import _ICacheOptions from "./interface/cache/ICacheOptions";
import _ICacheRedisModelOptions from "./interface/cache/ICacheRedisModelOptions";

import _IConfigCache from "./interface/config/IConfigCache";

import _IEntityItemsFilter from "./interface/entity/items/IEntityItemsFilter";
import _IEntityItemsCountParams from "./interface/entity/items/IEntityItemsCountParams";
import _IEntityItemsJoin from "./interface/entity/items/IEntityItemsJoin";
import _IEntityItemsParams from "./interface/entity/items/IEntityItemsParams";
import _IEntityItemsSort from "./interface/entity/items/IEntityItemsSort";
import _IEntityItemsWhere from "./interface/entity/items/IEntityItemsWhere";

import _IEntitySQLMakeResponse from "./interface/entity/sql/make/IEntitySQLMakeResponse";
import _IEntitySQLMakeErrorResponse from "./interface/entity/sql/make/IEntitySQLMakeErrorResponse";
import _IEntitySQLMakeListResponse from "./interface/entity/sql/make/IEntitySQLMakeListResponse";

import _IEntitySQLMakeScheme from "./interface/entity/sql/IEntitySQLMakeScheme";
import _IEntitySQLModel from "./interface/entity/sql/IEntitySQLModel";
import _IEntitySQLModelOptions from "./interface/entity/sql/IEntitySQLModelOptions";

import _IEntityModelOptions from "./interface/entity/IEntityModelOptions";
import _IEntityCacheOptions from "./interface/entity/IEntityCacheOptions";
import _IEntityResponse from "./interface/entity/IEntityResponse";


import _CacheEntity from "./entity/CacheEntity";
import _Entity from "./entity/Entity";
import _List from "./entity/List";

import appModel from './model/AppModel';
import RegistryModel from "./model/RegistryModel";
import configModel from "./model/ConfigModel";

import _CacheBaseModel from './model/cache/CacheBaseModel';
import * as cfm from './model/cache/CacheFactoryModel';
import _CacheMemoryModel from './model/cache/CacheMemoryModel';
import _CacheRedisModel from './model/cache/CacheRedisModel';

import _EntityModel from './model/entity/EntityModel';
import _EntitySQLModel from './model/entity/EntitySQLModel';
import _EntityBaseSQLModel from './model/entity/EntityBaseSQLModel';
import _EntityCacheModel from './model/entity/EntityCacheModel';

import * as events from './model/event/Events';
import globalEventModel from './model/event/GlobalEventModel';


namespace BestApps {
    export namespace interfaces {
        export interface ICacheEntity extends _ICacheEntity {
        }

        export interface ICacheFactoryModel extends _ICacheFactoryModel {
        }

        export interface ICacheFactoryModelOptions extends _ICacheFactoryModelOptions {
        }

        export interface ICacheModel extends _ICacheModel {
        }

        export interface ICacheModelOptions extends _ICacheModelOptions {
        }

        export interface ICacheOptions extends _ICacheOptions {
        }

        export interface ICacheRedisModelOptions extends _ICacheRedisModelOptions {
        }

        export interface IConfigCache extends _IConfigCache {
        }

        export interface IEntityItemsFilter extends _IEntityItemsFilter {
        }

        export interface IEntityItemsCountParams extends _IEntityItemsCountParams {
        }

        export interface IEntityItemsJoin extends _IEntityItemsJoin {
        }

        export interface IEntityItemsParams extends _IEntityItemsParams {
        }

        export interface IEntityItemsSort extends _IEntityItemsSort {
        }

        export interface IEntityItemsWhere extends _IEntityItemsWhere {
        }

        export interface IEntitySQLMakeResponse extends _IEntitySQLMakeResponse {
        }

        export interface IEntitySQLMakeErrorResponse extends _IEntitySQLMakeErrorResponse {
        }

        export interface IEntitySQLMakeListResponse extends _IEntitySQLMakeListResponse {
        }

        export interface IEntitySQLMakeScheme extends _IEntitySQLMakeScheme {
        }

        export interface IEntitySQLModel extends _IEntitySQLModel {
        }

        export interface IEntitySQLModelOptions extends _IEntitySQLModelOptions {
        }

        export interface IEntityModelOptions extends _IEntityModelOptions {
        }

        export interface IEntityCacheOptions extends _IEntityCacheOptions {
        }

        export interface IEntityResponse extends _IEntityResponse {
        }
    }

    export namespace entities {
        export class CacheEntity extends _CacheEntity {

        }

        export class Entity extends _Entity {

        }

        export class List extends _List {

        }

    }

    export namespace models {
        export function getAppModel() {
            return appModel;
        }
        export function getRegistryModel() {
            return RegistryModel;
        }
        export function getConfigModel() {
            return configModel;
        }

        export function getGlobalEventModel() {
            return globalEventModel;
        }

        export function getEvents(){
            return events;
        }

        export class CacheBaseModel extends _CacheBaseModel {}
        export class CacheMemoryModel extends _CacheMemoryModel {}
        export class CacheRedisModel extends _CacheRedisModel {}
        export class EntityModel extends _EntityModel {}
        export class EntitySQLModel extends _EntitySQLModel {}
        export class EntityBaseSQLModel extends _EntityBaseSQLModel {}
        export class EntityCacheModel extends _EntityCacheModel {}
        export class CacheFactoryModel extends cfm.CacheFactoryModel {}
    }
}

export = BestApps;
