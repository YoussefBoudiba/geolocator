# 4. Geolocator:

## Consume external rest api using the destination service

Our app is now secured but the data is still coming from a csv file.
We will now consume an external api using the destination service in BTP.

## Mocklab

Mocklab will provide the necessary data. Any online restful (mock) api will do, but for our Geolocator app this is more than enough.

url: https://j1z46.mocklab.io/Users
Protected via basic authentication:
username: **geolocator**
password: **geolocator**

## BTP

To consume the api safely (and still locally), we will create a destination containing the security info (username/password).

Assuming you are using a trial account, these are the steps to follow:

Navigate to:
https://account.hanatrial.ondemand.com/trial/#/home/trial

Go to your **trial** subaccount

**Connectivity** >> **Destinations**

Create new destination

| Key            | Value                     |
| -------------- | ------------------------- |
| Name           | GEO_API                   |
| URL            | https://j1z46.mocklab.io/ |
| Authentication | BasicAuthentication       |
| User           | geolocator                |
| Password       | geolocator                |

## Login to Cloud foundry

Login to the cloud foundry organization using

```bash
cf api https://api.cf.us10.hana.ondemand.com
cf login
```

## Services instances

To be able to consume the destination locally, we need an environment file containing the necessary credentials so that we can connect with the external api. The environment file is none other than the **default-env.json** file.
We need a **XSUAA** instance to fetch an **access token** for our destination. We also need a **destination service** instance to fetch **authToken** that we can use to authenticate ourself with mocklab.

### Destination service

Now that we have our destination we create a destination instance and key via the cloud foundry cli:

```bash
cf create-service destination lite l-destination-service
cf create-service-key l-destination-service l-destination-key
```

We then fetch the credentials using:

```bash
cf service-key l-destination-service l-destination-key > destination-credentials.json
```

### XSUAA

We do the same for the xsuaa

```bash
cf create-service xsuaa application l-uaa-service
cf create-service-key l-uaa-service l-uaa-key
cf service-key l-uaa-service l-uaa-key > uaa-credentials.json
```

### default-env.json

Create at the root of the project the default-env.json file and paste the following:

```json
{
    "VCAP_SERVICES": {
        "xsuaa": [
            {
                "name": "l-uaa-service",
                "label": "xsuaa",
                "tags": [
                    "xsuaa"
                ],
                "credentials": <uaa-credentials.json>
            }
        ],
        "destination": [
            {
                "name": "l-destination-service",
                "label": "destination",
                "tags": [
                    "destination"
                ],
                "credentials":<destination-credentials.json>
            }
        ]
    }
}
```

(only past the object between <>)

## CAP

Instead of reading CSV data, we will add a custom event handler that will fetch the data from the mock api using the destination service.

First **delete or rename** the csv file.

The custom event handler is written in Typescript.

### Typescript

Add the following **tsconfig.json** file under the **srv** folder:

```json
{
  "compilerOptions": {
    "allowUnreachableCode": false,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noPropertyAccessFromIndexSignature": true,
    "useUnknownInCatchVariables": true,
    "target": "ES2020",
    "module": "commonjs",
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "esModuleInterop": true
  },
  "exclude": ["node_modules", "lib", "tests", "gen", "srv/dist"]
}
```

### xsenv module

We need to install the xsenv module. This a utility module for easily reading application configurations for bound services and certificates in the SAP Cloud Platform Cloud Foundry environment

```bash
npm i @sap/xsenv
```

### Service definition

Update the service definition (geolocator-service.cds) with:

```cds
using {com.geolocator as db} from '../db/datamodel';

@impl : './dist/geolocator-service.js'
@(requires : 'authenticated-user')
@path : 'service/geolocator'
service GeolocatorService {
    entity Users @(restrict : [{
        grant : ['READ'],
        to    : ['GeoViewer']
    }]) as projection on db.Users;
}
```

As CAP only understand vanilla javascript we need to point to a directory that contains our compiled ts file.

Create **src/geolocator-service.ts** under **srv** folder and add the following:

```ts
const axios = require("axios").default;
const xsenv = require("@sap/xsenv");

module.exports = (srv: any) => {
  srv.on("READ", "Users", async (req: any) => {
    try {
      //@ts-ignore
      const sDestinationName = process.env.API_DESTINATION as string;
      let config = await getAxiosConfigBasic(sDestinationName);
      const destinationServiceResponse = await axios.get("/Users", {
        baseURL: config.destinationServiceBaseUrl,
        headers: { Authorization: `Basic ${config.authToken}` },
      });
      const users = destinationServiceResponse.data.results;
      return users;
    } catch (error) {
      return [];
    }
  });
};

// Helper functions
const getAxiosConfigBasic = async (destination: string) => {
  xsenv.loadEnv();
  const xsuaa_service = xsenv.serviceCredentials({ label: "xsuaa" });
  const destination_service = xsenv.serviceCredentials({
    label: "destination",
  });
  // 1. Get Access Token
  const xsuaaResponse = await axios.get(
    "/oauth/token?grant_type=client_credentials",
    {
      baseURL: xsuaa_service.url,
      auth: {
        username: destination_service.clientid,
        password: destination_service.clientsecret,
      },
    }
  );
  const accessToken = xsuaaResponse.data.access_token;
  // 2.  Get Auth Token
  const destinationResponse = await axios.get(
    `/destination-configuration/v1/destinations/${destination}`,
    {
      baseURL: destination_service.uri,
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const destinationServiceBaseUrl =
    destinationResponse.data.destinationConfiguration.URL;
  const authToken = destinationResponse.data.authTokens[0].value;
  return {
    destinationServiceBaseUrl: destinationServiceBaseUrl,
    authToken: authToken,
  };
};
```

Compile the source code:

```bash
cd srv
tsc
cd ..
```

Add an environment variable in your launch.json file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "cds run --with-mocks --in-memory?",
      "name": "cds run",
      "request": "launch",
      "type": "node-terminal",
      "env": {
        "API_DESTINATION": "GEO_API"
      },
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Run the app

Run the app in debug mode.
(our env variabel will only be picked up in debug mode, to counter this you can create a .env file containing the variabel).

The result is the same as before, except for the fact that the data is now coming from an external api.
