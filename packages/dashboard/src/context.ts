import { dataSources } from "./datasources";

export const context = () => ({});

export type GraphqlContextType = ReturnType<typeof context> & {
  dataSources: ReturnType<typeof dataSources>;
};
