# 1. Geolocator:

## Create a CAP service

The first step toward creating our **Geolocator** app is the creation of a CAP service that will serve mock data.

## CAP

Assuming you have the necessary software installed (and using Visual Code as IDE), execute following command to create a basic CAP application:

Initialise a CAP application

```bash
cds init geolocator
cd geolocator
```

Open the project in Visual Code

```bash
code .
```

Install required Nodejs modules

```bash
npm i
```

Start the CAP server

```bash
cds watch
```

If everything goes well you'll have a running CAP server.

## Datamodel

Let us define our datamodel.

Under the **db** folder create the **datamodel.cds** file and paste the following User entity definition:

```cds
namespace com.geolocator;

using {managed} from '@sap/cds/common';

entity Users : managed {
    key ID          : UUID @(Core.Computed : true);
        fullName    : String;
        lastName    : String;
        phoneNumber : String;
        email       : String;
        city        : String;
        map         : String;
}
```

## Service

We will create a service that will expose the data.

Under the **srv** folder create the **geolocator-service.cds** file and paste the following service definition:

```cds
using {com.geolocator as db} from '../db/datamodel';

@path : 'service/geolocator'
service GeolocatorService {
    entity Users as projection on db.Users;
}
```

## Data

Last thing we'll need is to provide mock data to test our service.
Under the **db/data** folder create the **com.geolocator-Users.csv** file and paste the following content:

```csv
ID;fullName;phoneNumber;email;city;map
84d22b2b-96cd-4f3c-9cd8-c82e6d2b7b67;Denise A. Ford;047 89 52 44;DeniseAFord@teleworm.be;Antwerpen;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d159792.40157247052!2d4.21768963325237!3d51.26039671368457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f68ebfc3887d%3A0x3eaf448482a88ab8!2sAntwerpen!5e0!3m2!1snl!2sbe!4v1660154764909!5m2!1snl!2sbe
7a9e7fdd-9ea5-42fd-825b-f16029a90fa6;Henry P. James;049 21 54 77;HenryPJames@rhyta.com;Gent;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160404.3761345462!2d3.574478903465415!3d51.084131601019706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c370e1339443ad%3A0x40099ab2f4d5140!2sGent!5e0!3m2!1snl!2sbe!4v1660154856324!5m2!1snl!2sbe
2290aeac-12c5-42f7-96a0-d8a5ee136b3a;Lynn A. Myers;047 26 45 88;LynnAMyers@dayrep.com;Genk;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80405.42861815849!2d5.41994059848502!3d50.966811858053006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0ded3c3a19e73%3A0x9c68915e1903c150!2s3600%20Genk!5e0!3m2!1snl!2sbe!4v1660154941418!5m2!1snl!2sbe
5eb606be-eefd-4c76-8ad4-667806df4cb4;Alvina A. Fleming;0470 47 11 63;AlvinaAFleming@armyspy.com;Brussel;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80598.63569397492!2d4.305377393882212!3d50.85510304095087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3a4ed73c76867%3A0xc18b3a66787302a7!2sBrussel!5e0!3m2!1snl!2sbe!4v1660155016971!5m2!1snl!2sbe
a3a2f119-85b6-479e-9b1b-e2ed012eecd4;Kristi M. Serrano;0487 71 55 02;kris.serr@hotmail.com;Leuven;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80548.47787137084!2d4.635327595077162!3d50.88412039536269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c160d05ebbdf85%3A0x40099ab2f4d5690!2sLeuven!5e0!3m2!1snl!2sbe!4v1660155291110!5m2!1snl!2sbe
b3bff6ef-04b6-450e-8275-e73f505a2e8a;Wesley P. Scott;0496 25 30 66;wesley@gmail.be;Charleroi;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d81343.59776502918!2d4.357801026132603!3d50.42270582775914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c225f096ca39c9%3A0x40099ab2f4d6410!2sCharleroi!5e0!3m2!1snl!2sbe!4v1660155334170!5m2!1snl!2sbe
fb696530-5155-4123-a78c-86b6f1690db9;Adrian T. Murray;0496 34 95 06;adrian.murr@proximus.com;Luik;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80996.36890476182!2d5.52923803440619!3d50.62458050666651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0f74b8eacfcfb%3A0x40099ab2f4d6b40!2sLuik!5e0!3m2!1snl!2sbe!4v1660155361284!5m2!1snl!2sbe
4644d056-857d-469b-9960-f383418a8a6f;Daniel D. Santiago;0498 52 83 10;daniel.d@hotmail.com;Oostende;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39987.36655025148!2d2.8863614649549154!3d51.215199474443345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47dca8d31895a595%3A0x3e97dbf009839842!2sOostende!5e0!3m2!1snl!2sbe!4v1660155394524!5m2!1snl!2sbe
65804320-b599-4213-bd59-673cf23caefd;Debrah J. McPeters;0491 25 02 26;debby@gmail.be;Antwerpen;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d159792.40157247052!2d4.21768963325237!3d51.26039671368457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3f68ebfc3887d%3A0x3eaf448482a88ab8!2sAntwerpen!5e0!3m2!1snl!2sbe!4v1660154764909!5m2!1snl!2sbe
fcc68dd7-c262-4d9f-b834-f6f2f909d8b9;Russell K. Wathen;0486 67 71 20;russel.wathen@outlook.com;Leuven;https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80548.47787137084!2d4.635327595077162!3d50.88412039536269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c160d05ebbdf85%3A0x40099ab2f4d5690!2sLeuven!5e0!3m2!1snl!2sbe!4v1660155291110!5m2!1snl!2sbe
```

## Run the service

Run follwing commands

```cds
cds watch
```

Check the result of your service at:

http://localhost:4004/service/geolocator/Users
