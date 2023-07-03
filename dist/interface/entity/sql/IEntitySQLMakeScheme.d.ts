import IEntitySQLModel from "./IEntitySQLModel";
interface IEntitySQLMakeScheme {
    field: string;
    type?: string;
    source?: {
        id: string;
        model?: IEntitySQLModel | string;
        callback?: (id: number | string, IEntitySchemeCallback: any) => void;
    };
    isLazy?: boolean;
    optional?: boolean;
}
export default IEntitySQLMakeScheme;
//# sourceMappingURL=IEntitySQLMakeScheme.d.ts.map