
export function YearsList(startYear){
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = startYear; year <= currentYear; year++) {
        years.push({ key: year.toString(), label: year.toString() });
    }
    return years;
}