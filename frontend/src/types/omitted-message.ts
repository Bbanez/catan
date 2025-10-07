export type OmittedMessage<T> = Omit<T, '$typeName' | '$unknown'>;
