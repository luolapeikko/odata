export const edmTypes = ['Edm.String', 'Edm.Boolean', 'Edm.Guid', 'Edm.Int32', 'Edm.Int64'] as const;
export type EdmSingletonType = (typeof edmTypes)[number];

export function isEdmSingletonType(type: string): type is EdmSingletonType {
	return edmTypes.includes(type as EdmSingletonType);
}

export type EdmCollectionType = `Collection(${EdmSingletonType})`;
export function isEdmCollectionType(type: string): type is EdmCollectionType {
	return type.startsWith('Collection(') && isEdmSingletonType(type.slice(11, -1));
}

export type EdmType = EdmSingletonType | EdmCollectionType;

export function isEdmType(type: unknown): type is EdmType {
	return typeof type === 'string' && (isEdmSingletonType(type) || isEdmCollectionType(type));
}
