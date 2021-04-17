export function getCategories() {
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : [];
}

export function getCategoriesMap() {
    const categories = getCategories();
    const categoriesMap = {};
    for (const category of categories) {
        categoriesMap[category.id] = category.name;
    }
    return categoriesMap;
}

export function getLocations() {
    const locations = localStorage.getItem('locations');
    return locations ? JSON.parse(locations) : [];
}