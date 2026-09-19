export function Sort (field, sortType, data) {
    let sortedArray = [...data]; // Create a copy to avoid mutating original data

    if (sortType === 'asc') {
        sortedArray.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    } else if (sortType === 'desc') {
        sortedArray.sort((a, b) => (a[field] < b[field] ? 1 : -1));
    }
    return sortedArray;
};