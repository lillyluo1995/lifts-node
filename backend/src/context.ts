import { DatabaseAPI} from "./datasources/database-api";

export type DataSourceContext = {
    dataSources: {
        db: DatabaseAPI
    };
}