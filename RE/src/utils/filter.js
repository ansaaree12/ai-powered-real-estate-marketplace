export const applyFilters = (properties, filters) => {
    return properties.filter((property) => {
        const { bedrooms, bathrooms, parking, pools, houseType } = filters;

        return (
            (!bedrooms || property.facilities.bedrooms === bedrooms) &&
            (!bathrooms || property.facilities.bathrooms === bathrooms) &&
            (!parking || property.facilities.parking === parking) &&
            (!pools || property.facilities.pools === pools) &&
            (!houseType || property.houseType === houseType)
        );
    });
};
