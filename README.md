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

The mock api should return the following:

``` json
{
  "results": [
    {
      "ID": "84d22b2b-96cd-4f3c-9cd8-c82e6d2b7b67",
      "fullName": "Denise A. Ford",
      "phoneNumber": "047 89 52 44",
      "email": "DeniseAFord@teleworm.be",
      "city": "Antwerpen",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d159792.40157247052!2d4.21768963325237!3d51.26039671368457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f68ebfc3887d%3A0x3eaf448482a88ab8!2sAntwerpen!5e0!3m2!1snl!2sbe!4v1660154764909!5m2!1snl!2sbe"
    },
    {
      "ID": "7a9e7fdd-9ea5-42fd-825b-f16029a90fa6",
      "fullName": "Henry P. James",
      "phoneNumber": "049 21 54 77",
      "email": "HenryPJames@rhyta.com",
      "city": "Gent",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160404.3761345462!2d3.574478903465415!3d51.084131601019706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c370e1339443ad%3A0x40099ab2f4d5140!2sGent!5e0!3m2!1snl!2sbe!4v1660154856324!5m2!1snl!2sbe"
    },
    {
      "ID": "2290aeac-12c5-42f7-96a0-d8a5ee136b3a",
      "fullName": "Lynn A. Myers",
      "phoneNumber": "047 26 45 88",
      "email": "LynnAMyers@dayrep.com",
      "city": "Genk",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80405.42861815849!2d5.41994059848502!3d50.966811858053006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0ded3c3a19e73%3A0x9c68915e1903c150!2s3600%20Genk!5e0!3m2!1snl!2sbe!4v1660154941418!5m2!1snl!2sbe"
    },
    {
      "ID": "5eb606be-eefd-4c76-8ad4-667806df4cb4",
      "fullName": "Alvina A. Fleming",
      "phoneNumber": "0470 47 11 63",
      "email": "AlvinaAFleming@armyspy.com",
      "city": "Brussel",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80598.63569397492!2d4.305377393882212!3d50.85510304095087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3a4ed73c76867%3A0xc18b3a66787302a7!2sBrussel!5e0!3m2!1snl!2sbe!4v1660155016971!5m2!1snl!2sbe"
    },
    {
      "ID": "a3a2f119-85b6-479e-9b1b-e2ed012eecd4",
      "fullName": "Kristi M. Serrano",
      "phoneNumber": "0487 71 55 02",
      "email": "kris.serr@hotmail.com",
      "city": "Leuven",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80548.47787137084!2d4.635327595077162!3d50.88412039536269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c160d05ebbdf85%3A0x40099ab2f4d5690!2sLeuven!5e0!3m2!1snl!2sbe!4v1660155291110!5m2!1snl!2sbe"
    },
    {
      "ID": "b3bff6ef-04b6-450e-8275-e73f505a2e8a",
      "fullName": "Wesley P. Scott",
      "phoneNumber": "0496 25 30 66",
      "email": "wesley@gmail.be",
      "city": "Charleroi",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d81343.59776502918!2d4.357801026132603!3d50.42270582775914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c225f096ca39c9%3A0x40099ab2f4d6410!2sCharleroi!5e0!3m2!1snl!2sbe!4v1660155334170!5m2!1snl!2sbe"
    },
    {
      "ID": "fb696530-5155-4123-a78c-86b6f1690db9",
      "fullName": "Adrian T. Murray",
      "phoneNumber": "0496 34 95 06",
      "email": "adrian.murr@proximus.com",
      "city": "Luik",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80996.36890476182!2d5.52923803440619!3d50.62458050666651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0f74b8eacfcfb%3A0x40099ab2f4d6b40!2sLuik!5e0!3m2!1snl!2sbe!4v1660155361284!5m2!1snl!2sbe"
    },
    {
      "ID": "4644d056-857d-469b-9960-f383418a8a6f",
      "fullName": "Daniel D. Santiago",
      "phoneNumber": "0498 52 83 10",
      "email": "daniel.d@hotmail.com",
      "city": "Oostende",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39987.36655025148!2d2.8863614649549154!3d51.215199474443345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dca8d31895a595%3A0x3e97dbf009839842!2sOostende!5e0!3m2!1snl!2sbe!4v1660155394524!5m2!1snl!2sbe"
    },
    {
      "ID": "65804320-b599-4213-bd59-673cf23caefd",
      "fullName": "Debrah J. McPeters",
      "phoneNumber": "0491 25 02 26",
      "email": "debby@gmail.be",
      "city": "Antwerpen",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d159792.40157247052!2d4.21768963325237!3d51.26039671368457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f68ebfc3887d%3A0x3eaf448482a88ab8!2sAntwerpen!5e0!3m2!1snl!2sbe!4v1660154764909!5m2!1snl!2sbe"
    },
    {
      "ID": "fcc68dd7-c262-4d9f-b834-f6f2f909d8b9",
      "fullName": "Russell K. Wathen",
      "phoneNumber": "0486 67 71 20",
      "email": "russel.wathen@outlook.com",
      "city": "Leuven",
      "map": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80548.47787137084!2d4.635327595077162!3d50.88412039536269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c160d05ebbdf85%3A0x40099ab2f4d5690!2sLeuven!5e0!3m2!1snl!2sbe!4v1660155291110!5m2!1snl!2sbe"
    }
  ]
}
```
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
