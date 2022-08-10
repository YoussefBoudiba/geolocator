# 3. Geolocator:

## Roles and Authorization Checks In CAP

At the moment, anyone can access our data exposed by the service. Let us now secure access to our data by implementing roles and authorization in CAP

## Install Passport

As we are using the Nodejs runtime of CAP, we will add the **passport** module to enable authentication.

(passport is a Express-compatible authentication middleware for Node.js)

```bash
npm install passport
```

## CAP role restrictions

We restrict access to Users data by adding following restriction to the **geolocator-service.cds**:

```cds
using {com.geolocator as db} from '../db/datamodel';

@(requires : 'authenticated-user')
@path : 'service/geolocator'
service GeolocatorService {
    entity Users @(restrict : [{
        grant : ['READ'],
        to    : ['GeoViewer']
    }]) as projection on db.Users;
}
```

Only **authenticated** user with the **GeoViewer** role can now access our data.

## Add local user for testing

In CAP we are able to add test users with specific role. This all happen in the **.cdsrc.json** file:

```json
{
  "auth": {
    "passport": {
      "strategy": "mock",
      "users": {
        "geo@test.com": {
          "password": "password",
          "ID": "geo@test.com",
          "roles": ["authenticated-user", "GeoViewer"]
        }
      }
    }
  }
}
```

## Test the app

When accessing the service in your browser, you get a basic auth popup now, asking for your user and password.

username: geo@test.com
password: **password**

(you may want to restart your browser first)
