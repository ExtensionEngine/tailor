# Integration API

## Add integration user

To add integration user run:

```shell
npm run integration:add
```

to generate a integration token run:

```shell
npm run integration:token
```

Use generated token to update `access_token` global variable for the provided
Postman collection. Also make sure that the `base_url` variable is properly set.

## External access management

To disable the ability for users to create repositories set 
`EXTERNAL_ACCESS_MANAGEMENT` .env variable to true. This will lock
repository catalog UI access, remove the ability to clone repositories, and
remove repository based user management UI.
