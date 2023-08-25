### Version 1.0.24
Fix issues with WHERE filter

### Version 1.0.23
createAsync  isSource fix

### Version 1.0.19
IEntitySQLModelOptions
added make.onAfter - possible to fill data after make

Entity:
added ignoredProperties property to ignore in getModifiedProperties() call


### Version 1.0.18

generateUid(callback) changed to generateUid(entity: Entity, callback) 
to make possibility to override schema generation
same is for generateUidAsync() to generateUidAsync(entity: Entity)
### Version 1.0.16

Sort field fix
JOIN field fix
Entity allData fix

### Version 1.0.12
1. Added in model:
schema.callback - gives possibility to load external object (see test/model/MainModel.ts for spcialModel)
schema.type:
- uid - marking this field as UID field (event with other name, see test/model/SpecialModel.ts) 
- created - marking this field as CREATED field (unix timestamp)

2. Added events:
EVENT_SQL_CONNECTED - use it if you want to check DB table data for each model, send on sql.connect was success
EVENT_SQL_MODEL_LOADING
EVENT_SQL_MODEL_LOADED
EVENT_SQL_MODELS_LOADED

3. Fix for models which not have in DB table fields: uid, created.
Will be ignored in create DB row action (create, createAsync)

4. Added AppModel - will figure out each model load status (see statuses upper) 
and send signaling EVENT_SQL_MODELS_LOADED which indicates ALL models loaded successfully

5. Improved autotests
6. Exported all interfaces
7. Added AppModel


### Version 1.0.11
Added callback in schema - schema.callback

### Version 1.0.5
Changed exports

### Version 1.0.3

Moved to ts and fixed ts types for external usage

### Version 1.0.2

Added List entity

### Version 1.0.0

Minimal required working version
