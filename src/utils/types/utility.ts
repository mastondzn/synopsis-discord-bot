export type ParametersExceptFirst<F> = F extends (
    argument: unknown,
    ...rest: infer R
) => unknown
    ? R
    : never;
