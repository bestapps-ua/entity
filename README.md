#Contents

- [Examples](#Examples)

- [Configuration](#Configuration)

- [Unit tests](#Unit-tests)

# Examples

See `test/model` and `test/tests`

# Configuration

You need to setup:
- sql model
- config model
- registry model
- app model
- your models extended from EntitySQLModel

See all below.

### SQLModel

Copy paste from test/model/SQLModel.ts

### Config and Registry Models
Requiring to normal work of models

``` 
import {configModel} from '@bestapps/microservice-entity';
import {RegistryModel} from '@bestapps/microservice-entity';


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

# APP Model
Responsible for models loading, requires EVENT_SQL_CONNECTED to be sent

In your code just do:
```
import {appModel} from "@bestapps/microservice-entity";
appModel.init();

```

# Entity Models

Examples is in test/model

### Basic scheme
```
import {EntitySQLModel} from "@bestapps/microservice-entity";

import Main from "../entity/Main";

let options: any = {
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

where type can be:
- json (data in Object)
- uid (indicates that field is we using for uid)
- created (when entity created in unix timestamp format)

where Main is
```
import {Entity} from "@bestapps/microservice-entity";

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

# Unit tests

1. Create special MySQL DB for project
2. mysqldump data from data/init.sql
3. Setup local config in config/ directory:

```
  cp test.example.json local.json
```
4. Fill there db category with all required data

Now you can test everything:

```
    npm run unit
```

If you want to test some script you can do for example:

```
    npm run unit -- create.test.ts
```


