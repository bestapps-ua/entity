import ICacheModelOptions from "./ICacheModelOptions";
interface ICacheRedisModelOptions extends ICacheModelOptions {
    connection?: {
        port?: number;
        host?: string;
        username?: string;
        password?: string;
    };
}
export default ICacheRedisModelOptions;
//# sourceMappingURL=ICacheRedisModelOptions.d.ts.map