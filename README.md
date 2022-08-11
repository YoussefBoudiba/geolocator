# 4. Geolocator

## Deploy to BTP using MTA

Until now the app has been running locally on our computers. It is now time to deploy our application to BTP and use it from there.

## Add security descriptor file

Our app is secured as only **authenticated** users with **GeoViewer** **role** can access the Users data.
But we need to tell BTP what and how to create those roles.

Using cds cli we can create the security descriptor (xs-security.json) and extend cap configuration using:

```bash
cds add xsuaa --for production
```

This adds the XSUAA service to the `package.json` file of our project and creates the XSUAA security configuration file: **xs-security.json**

```json
{
  "xsappname": "geolocator",
  "scopes": [
    {
      "name": "$XSAPPNAME.GeoViewer",
      "description": "GeoViewer"
    }
  ],
  "attributes": [],
  "role-templates": [
    {
      "name": "GeoViewer",
      "description": "generated",
      "scope-references": ["$XSAPPNAME.GeoViewer"],
      "attribute-references": []
    }
  ]
}
```

## package.json

Update the packackge.json by declaring a nodejs version and adding additional scripts:

```json
{
  "engines": {
    "node": "^16"
  },
  "name": "geolocator",
  ...
  "scripts": {
    "start": "cds run",
    "api:trial": "cf api https://api.cf.us10.hana.ondemand.com && cf login",
    "tsc:srv": "cd srv && tsc && cd ..",
    "build:ui": "ui5 build --config=ui/ui5.yaml --clean-dest --dest ui/dist --include-task=generateManifestBundle",
    "build": "mbt build --mtar=geolocator.mtar"
  }
  ...
```

## Add MTA descriptor file

Create mta.yaml file and paste the following content:

```yaml
# ---------------------------------------------------------------
# --------------------- Geolocator IaC --------------------------
# ---------------------------------------------------------------
_schema-version: "3.1"
ID: geolocator
version: 1.0.0
description: "Geolocator App"
parameters:
  enable-parallel-deployments: true
build-parameters:
  before-all:
    - builder: custom
      commands:
        - npm run tsc:srv
        - npx -p @sap/cds-dk cds build --production
# ---------------------------------------------------------------
# --------------------- MODULES ---------------------------------
# ---------------------------------------------------------------
modules:
  # ---------------------------------------------------------------
  # --------------------- SERVER MODULE ---------------------------
  # ---------------------------------------------------------------
  - name: geolocator-srv
    type: nodejs
    path: gen/srv
    parameters:
      disk-quota: 256M
      memory: 128M
      keep-existing:
        service-bindings: true
    properties:
      API_DESTINATION: "GEO_API"
    provides:
      - name: srv-api # required by consumers of CAP services (e.g. approuter)
        public: true
        properties:
          srv-url: ${default-url}
    requires:
      - name: geolocator-destination
      - name: geolocator-uaa
  # ---------------------------------------------------------------
  # --------------------- DEST CONTENT ----------------------------
  # ---------------------------------------------------------------
  - name: geolocator-destination-content # The managed approuter uses to access the UI of the application, and it's used for authentication.
    type: com.sap.application.content
    requires:
      - name: geolocator-uaa
        parameters:
          service-key:
            name: geolocator-uaa-service-key
      - name: geolocator-html-repo-host
        parameters:
          service-key:
            name: geolocator-html-repo-host-service-key
      - name: geolocator-destination
        parameters:
          content-target: true
          service-key:
            name: geolocator-destination-service-key
    parameters:
      content:
        instance:
          destinations:
            - Name: geolocator-html-repo-host-service
              ServiceInstanceName: geolocator-html-repo-host
              ServiceKeyName: geolocator-html-repo-host-service-key
              sap.cloud.service: basic.service
            - Authentication: OAuth2UserTokenExchange
              Name: geolocator-uaa-service
              ServiceInstanceName: geolocator-uaa
              ServiceKeyName: geolocator-uaa-service-key
              sap.cloud.service: basic.service
          existing_destinations_policy: update
    build-parameters:
      no-source: true
  # ---------------------------------------------------------------
  # --------------------- UI DEPLOYER -----------------------------
  # ---------------------------------------------------------------
  # Enables content to be uploaded automatically with the Generic Application Content Deployer (GACD) module
  - name: geolocator-ui-deployer
    type: com.sap.application.content
    path: ui_deployer
    requires:
      - name: geolocator-html-repo-host
        parameters:
          content-target: true
    build-parameters:
      build-result: resources
      requires:
        - artifacts:
            - HTML5Module.zip
          name: geolocator-HTML5Module
          target-path: resources/
  # ---------------------------------------------------------------
  # --------------------- HTML5 MODULE ----------------------------
  # ---------------------------------------------------------------
  - name: geolocator-HTML5Module
    type: html5
    path: app/geolocator/webapp
    build-parameters:
      builder: custom
      commands:
        - npm run build
      supported-platforms: []
# ---------------------------------------------------------------
# --------------------- RESOURCES -------------------------------
# ---------------------------------------------------------------
resources:
  # ---------------------------------------------------------------
  # --------------------- DESTINATION RESOURCE --------------------
  # ---------------------------------------------------------------
  - name: geolocator-destination
    type: org.cloudfoundry.managed-service
    parameters:
      service: destination
      service-name: geolocator-destination
      service-plan: lite
      config:
        HTML5Runtime_enabled: true
        version: 1.0.0
        init_data:
          instance:
            destinations:
              - Authentication: NoAuthentication
                HTML5.ForwardAuthToken: true
                Name: srv-api
                ProxyType: Internet
                Type: HTTP
                URL: ~{srv-api/srv-url}
            existing_destinations_policy: update
    requires:
      - name: srv-api
  # ---------------------------------------------------------------
  # --------------------- HTML5 RESOURCE --------------------------
  # ---------------------------------------------------------------
  - name: geolocator-html-repo-host
    type: org.cloudfoundry.managed-service
    parameters:
      service: html5-apps-repo
      service-plan: app-host
  # ---------------------------------------------------------------
  # --------------------- UAA RESOURCE ----------------------------
  # ---------------------------------------------------------------
  - name: geolocator-uaa
    type: org.cloudfoundry.managed-service
    parameters:
      path: ./xs-security.json
      service: xsuaa
      service-plan: application
      config:
        xsappname: geolocator-${org}-${space}
        tenant-mode: dedicated
```

## Deploy the MTA

Before deploying our application we make sure to first delete the **data** folder under **db**.

Build the mta descriptor file into mtar.

```bash
npm run build
```

Note this will not succeed.. can you guess why?


<details>
<summary>Show answer</summary>

You need to create at the root of your project:

**ui_deployer/resources**

</details>


Deploy the module to your current Cloud Foundry space:

```bash
cf deploy mta_archives/geolocator.mtar
```

Now navigate to your trial subaccount
Under **HTML5 Applications** you will find your deployed application.

Assuming you created the necessary roles, you'll now have a deployed Geolocator app!
