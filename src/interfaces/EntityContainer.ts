import type {EdmEntrySet} from '../EntrySet';
import type {EdmSingleton} from '../Singleton';

export interface EntityContainer {
	name: string;
	set: Record<string, EdmEntrySet | EdmSingleton>;
}
