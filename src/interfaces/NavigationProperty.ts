import type {EdmPropertyBase} from '.';
import type {EdmOnDelete} from './OnDelete';
import type {EdmReferentialConstraint} from './ReferentialConstraint';

export interface EdmNavigationProperty extends EdmPropertyBase {
	stype: 'Edm.NavigationProperty';
	partner?: string;
	containsTarget?: boolean;
	onDelete?: EdmOnDelete;
	referentialConstraint?: EdmReferentialConstraint[];
}
