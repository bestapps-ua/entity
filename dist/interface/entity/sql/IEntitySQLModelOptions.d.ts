import IEntityModelOptions from "../IEntityModelOptions";
import IEntitySQLMakeScheme from "./IEntitySQLMakeScheme";
interface IEntitySQLModelOptions extends IEntityModelOptions {
    table: string;
    schemas: IEntitySQLMakeScheme[];
}
export default IEntitySQLModelOptions;
//# sourceMappingURL=IEntitySQLModelOptions.d.ts.map