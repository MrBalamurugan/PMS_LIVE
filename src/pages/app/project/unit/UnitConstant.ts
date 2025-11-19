
interface LabelValue<T> {
    value: T
    label: string
}

export const UnitType: LabelValue<string>[] = [
    { label: "Apartment", value: "apartment" },
    { label: "Villa", value: "villa" },
    { label: "Plot", value: "plot" },
    { label: "Commercial", value: "commercial" },
    { label: "Other", value: "other" },
];

export const UnitOrientation: LabelValue<string>[] = [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" },
    { label: "Northeast", value: "northeast" },
    { label: "Northwest", value: "northwest" },
    { label: "Southeast", value: "southeast" },
    { label: "Southwest", value: "southwest" },
    { label: "Other", value: "other" },
];

export const UnitStage: LabelValue<string>[] = [
    { label: "Planning", value: "planning" },
    { label: "Under Construction", value: "under_construction" },
    { label: "Ready to Move", value: "ready_to_move" },
    { label: "Sold", value: "sold" },
];
