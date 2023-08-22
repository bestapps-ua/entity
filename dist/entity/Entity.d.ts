declare class Entity {
    protected _props: any;
    protected _id: number;
    protected _created: number;
    protected _uid: string;
    protected _system: any;
    ignoredProperties: any[];
    constructor(props: any);
    /**
     * For lazy load please use this method
     * @param property
     * @private
     */
    protected _get(property: any): any;
    get props(): any;
    get id(): any;
    get created(): any;
    getClassName(): string;
    get allData(): {};
    get uid(): string;
    set uid(value: string);
    getModifiedProperties(): Promise<any[]>;
    get system(): any;
    set system(value: any);
}
export default Entity;
//# sourceMappingURL=Entity.d.ts.map