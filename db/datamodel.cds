namespace com.geolocator;

using {managed} from '@sap/cds/common';

entity Users : managed {
    key ID          : UUID @(Core.Computed : true);
        fullName    : String;
        phoneNumber : String;
        email       : String;
        city        : String;
        map         : String;
}
