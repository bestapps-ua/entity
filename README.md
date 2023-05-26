# Examples

See `test/model` and `test/tests`

# Test

`npm run unit`


# Configuration

### SQLModel

Copy paste from test/model/SQLModel.ts

### ConfigModel

``` 
let configModel = require('@bestapps/microservice-entity').configModel;
let RegistryModel = require('@bestapps/microservice-entity').RegistryModel;


configModel.setCacheConfig(config.cache);
RegistryModel.set('configModel', configModel);

```
where config.cache - is cache config from your config file eg:
```
    "cache": {
        "type": "memory",
        "prefix": "micro:entity",
        "models": [],
        "redis": {
            "connection": {
                "port": "6379",
                "host": "localhost",
                "login": "",
                "password": ""
            }
        }
    }
```

# Entity Models

Examples is in test/model

### Basic scheme
```
let EntitySQLModel = require('@bestapps/microservice-entity').EntitySQLModel;
let IEntitySQLModelOptions = require('@bestapps/microservice-entity').IEntitySQLModelOptions";

import Main from "../entity/Main";

let options: IEntitySQLModelOptions = {
    table: 'main',
    entity: Main,
    schemas: [
        {
            field: 'parent',
            source: {
                id: 'pid',
                model: 'this',
            },
            isLazy: true,
            optional: true,
        },
        {
            field: 'name'
        },
        {
            field: 'data',
            type: 'json',
        },
    ]
};

class MainModel extends EntitySQLModel {

}

export default new MainModel(options);
```

where Main is
```
let Entity = require('@bestapps/microservice-entity').Entity";

class Main extends Entity {

    private _name: string;
    private _parent: Main;
    private _data: any;

    constructor(props) {
        super(props);
        this._name = props.name;
        this._parent = props.parent;
        this._data = props.data;
    }

    get data(): any {
        return this._get('_data');
    }

    set data(value: any) {
        this._data = value;
    }
    get parent(): Main {
        return this._get('_parent');
    }

    set parent(value: Main) {
        this._parent = value;
    }
    get name(): string {
        return this._get('_name');
    }

    set name(value: string) {
        this._name = value;
    }
}

export default Main;

```
