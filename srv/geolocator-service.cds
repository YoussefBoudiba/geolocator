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
