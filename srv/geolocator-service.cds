using {com.geolocator as db} from '../db/datamodel';

@path : 'service/geolocator'
service GeolocatorService {
    entity Users as projection on db.Users;
}
