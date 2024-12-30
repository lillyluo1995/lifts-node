import { Amenity } from "./types"

export const validateFullAmenities = (amenityList: Amenity[]) => amenityList.some((amenity) => "name" in amenity );