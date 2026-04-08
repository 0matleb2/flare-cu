const fs = require('fs');
const file = 'src/data/locations.ts';
let content = fs.readFileSync(file, 'utf8');
content += `

export function getLocationDetails(locationId: string): { label: string, buildingCode?: string, buildingName?: string, entranceName?: string } {
	const option = flareLocationOptions.find(o => o.id === locationId);
	if (!option) return { label: locationId, buildingName: locationId };
	
	if (option.type === "building") {
		return { label: option.label, buildingCode: option.id, buildingName: option.label };
	} else if (option.type === "entrance") {
		const bCode = option.id.split("_")[0];
		const buildingOpt = buildingOptions.find(o => o.id === bCode);
		return { label: option.label, buildingCode: bCode, buildingName: buildingOpt ? buildingOpt.label : bCode, entranceName: option.label };
	} else {
		return { label: option.label, buildingName: option.label };
	}
}
`;
fs.writeFileSync(file, content);
